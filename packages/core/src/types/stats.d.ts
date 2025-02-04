import { TChainName } from './chains';
import { TMarketToken } from './tokens';

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

export type IMultichainTokenData = Partial<Record<TChainName, TChainTokenData>>;

export type TSymbolAggregationBalance = Record<string, TMarketToken>;

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
