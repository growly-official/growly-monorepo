'use client';
import React, { useState } from 'react';
import {
  TActivityStats,
  TChainStats,
  TChainTokenList,
  TMultichain,
  TTokenPortfolioStats,
  TTokenTransferActivity,
} from 'chainsmith/src/types';
import { TEVMScanTransaction } from 'chainsmith/src/adapters/evmscan/types';
import { StateEventRegistry } from '../types';

export enum BackgroundVariant {
  Image = 'Background Image',
  Color = 'Background Color',
}

const defaultActivityStats: TActivityStats = {
  totalTxs: 0,
  firstActiveDay: null,
  uniqueActiveDays: 0,
  longestStreakDays: 0,
  currentStreakDays: 0,
  activityPeriod: 0,
};

const defaultTokenPortfolioStats: TTokenPortfolioStats = {
  aggregatedBalanceByToken: {},
  aggregatedBalanceByChain: {},
  chainRecordsWithTokens: {},
  mostValuableToken: {
    allocations: {},
    marketData: {
      chainId: 0,
      decimals: 0,
      marketPrice: 0,
      name: '',
      symbol: '',
      tags: [],
    },
    totalBalance: 0,
    totalUsdValue: 0,
  },
  sumMemeUSDValue: 0,
  sumPortfolioUSDValue: 0,
  totalUsdValue: 0,
};

const defaultChainStats: TChainStats = {
  totalChains: [],
  noActivityChains: [],
  mostActiveChainID: '',
  mostActiveChainName: '',
  countUniqueDaysActiveChain: 0,
  countActiveChainTxs: 0,
};

export enum AppStage {
  DisplayProfile = 0,
  GetBased = 1,
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type UseState<T> = [T, SetState<T>];

export interface IMagicContext {
  appStage: UseState<AppStage>;
  exampleProfile: UseState<string | undefined>;
  stateEvents: StateEventRegistry;
  setStateEvents: SetState<StateEventRegistry>;

  // Data analytics states
  text: UseState<string>;
  inputAddress: UseState<string>;

  // Special name service
  oneID: UseState<string>;

  // Raw
  allTransactions: UseState<TMultichain<TEVMScanTransaction[]>>;
  tokenPortfolio: UseState<TMultichain<TChainTokenList>>;
  tokenActivity: UseState<TMultichain<TTokenTransferActivity[]>>;

  // Insights
  chainStats: UseState<TChainStats>;
  activityStats: UseState<TActivityStats>;
  tokenPortfolioStats: UseState<TTokenPortfolioStats>;
  totalGasInETH: UseState<number>;
}

export const MagicContext = React.createContext<IMagicContext>(undefined as any);

interface Props {
  children: React.ReactElement | React.ReactNode;
}

export const MagicProvider = ({ children }: Props) => {
  const exampleProfile = useState<string | undefined>(undefined);
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});

  const inputAddress = useState('');
  const text = useState('');
  const oneID = useState('');

  const appStage = useState<AppStage>(AppStage.DisplayProfile);
  // All transactions and activity stats
  const allTransactions = useState<TMultichain<TEVMScanTransaction[]>>({});
  const activityStats = useState<TActivityStats>(defaultActivityStats);
  const chainStats = useState<TChainStats>(defaultChainStats);

  // Multi-chain token portfolio
  const tokenPortfolio = useState<TMultichain<TChainTokenList>>({});
  const tokenPortfolioStats = useState<TTokenPortfolioStats>(defaultTokenPortfolioStats);

  // Multi-chain token & activity
  const tokenActivity = useState<TMultichain<TTokenTransferActivity[]>>({});

  const totalGasInETH = useState(0);

  return (
    <MagicContext.Provider
      value={{
        appStage,
        stateEvents,
        exampleProfile,
        setStateEvents,

        // Raw
        text,
        inputAddress,
        oneID,
        tokenPortfolio,
        tokenPortfolioStats,
        tokenActivity,
        allTransactions,

        // Insight
        activityStats,
        chainStats,
        totalGasInETH,
      }}>
      {children}
    </MagicContext.Provider>
  );
};
