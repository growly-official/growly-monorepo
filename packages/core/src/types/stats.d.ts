import type { TMultiChain, TChainId, TChainName } from './chains.d.ts';
import type { TMarketToken, TTokenSymbol, TTokenMetadataPrice } from './tokens.d.ts';

export type TChainStats = {
  totalChains: string[];
  noActivityChains: string[];
  mostActiveChainName: string;
  mostActiveChainID: string;
  countUniqueDaysActiveChain: number;
  countActiveChainTxs: number;
};

export type TActivityStats = {
  totalTxs: number;
  firstActiveDay: Date | null;
  uniqueActiveDays: number;
  longestStreakDays: number;
  currentStreakDays: number;
  activityPeriod: number;
};

export type TChainTokenData = {
  totalUsdValue: number;
  tokens: TMarketToken[];
};

export type TTokenChainData = {
  totalUsdValue: number;
  totalBalance: number;
  marketData: TTokenMetadataPrice;
  allocations: TMultiChain<TTokenValueByChain>;
};

export type TValueByChain = {
  chainId: number;
  totalUsdValue: number;
};

export type TTokenValueByChain = TValueByChain & {
  balance: number;
};

export type TTokenAggregationBalance = Record<TTokenSymbol, TTokenChainData>;
export type TChainAggregationBalance = Record<string, TValueByChain>; // Sorry Tin by didn't use TChainName

export type TTokenPortfolio = {
  totalUsdValue: number;
  aggregatedBalanceByToken: TTokenAggregationBalance;
  aggregatedBalanceByChain: TChainAggregationBalance;
};

// export type TTokenPortfolioStats = {
//   sumPortfolioUSDValue: number;
//   sumMemeUSDValue: number;
//   mostValuableToken: {
//     name: string;
//     symbol: string;
//     value: number;
//     logoURI: string;
//   };
//   aggregatedBalanceBySymbol: TTokenAggregationBalance;
//   chainRecordsWithTokens: TChainRecordWithTokens;
// };

export type TNumberInPercentage = number;

export type TNumberInMillisecond = number;
