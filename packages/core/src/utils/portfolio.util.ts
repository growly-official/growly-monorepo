import type {
  TMultichain,
  TChainTokenData,
  TTokenAggregationBalance,
  TChainName,
  TTokenPortfolio,
  TChainAggregationBalance,
} from '../types/index.d.ts';
import _ from 'lodash';
import { getChainIdByName } from './chain.util.ts';

export function aggregateMultichainTokenBalance(
  portfolio: TMultichain<TChainTokenData>
): TTokenPortfolio {
  let totalPortfolioValue = 0;

  const tokenAggregation: TTokenAggregationBalance = {};
  const chainAggregation: TChainAggregationBalance = {};

  for (const chainName in portfolio) {
    chainAggregation[chainName] = {
      chainId: getChainIdByName(chainName as TChainName),
      totalUsdValue: portfolio[chainName].totalUsdValue,
    };
  }

  // Iterate through each chain in the multiChainData
  for (const chainName in portfolio) {
    const chainData = portfolio[chainName as TChainName];

    // Iterate through each token in the chain
    for (const token of chainData.tokens) {
      const symbol = token.symbol;

      // Drop fields to avoid confusion
      const tokenMarketData = _.omit(token, ['balance', 'usdValue']);

      // Initialize the token in the aggregation if it doesn't exist
      if (!tokenAggregation[symbol]) {
        tokenAggregation[symbol] = {
          totalUsdValue: 0,
          totalBalance: 0,
          marketData: tokenMarketData,
          allocations: {},
        };
      }

      // Update the total USD & balance value for the token
      tokenAggregation[symbol].totalUsdValue += token.usdValue;
      tokenAggregation[symbol].totalBalance += token.balance;

      // Update the allocation for the current chain
      tokenAggregation[symbol].allocations[chainName] = {
        chainId: getChainIdByName(chainName as TChainName),
        balance: token.balance,
        usdValue: token.usdValue,
      };

      // Global: Update totalPortfolioValue
      totalPortfolioValue += token.usdValue;
    }
  }

  return {
    totalUsdValue: totalPortfolioValue,
    aggregatedBalanceByToken: tokenAggregation,
    aggregatedBalanceByChain: chainAggregation,
  } as TTokenPortfolio;
}
