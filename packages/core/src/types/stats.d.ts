import type { TChainName } from './chains.d.ts';
import type { TMarketToken, TTokenSymbol } from './tokens.d.ts';

export type IValueByChain = {
  chainName: string;
  value: number;
};

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

export type TSymbolAggregationBalance = Record<TTokenSymbol, TChainTokenData>;

export type TTokenPortfolioStats = {
  sumPortfolioUSDValue: number;
  sumMemeUSDValue: number;
  mostValuableToken: {
    name: string;
    symbol: string;
    value: number;
    logoURI: string;
  };
  aggregatedBalanceBySymbol: TSymbolAggregationBalance;
  chainRecordsWithTokens: TChainRecordWithTokens;
};

export type TNumberInPercentage = number;

export type TNumberInMillisecond = number;
