'use client';
import React, { useState } from 'react';
import {
  TActivityStats,
  TChainName,
  TChainStats,
  TMultichain,
  TMultiEcosystem,
  TTokenPortfolio,
  TTokenPortfolioStats,
  TTokenTransferActivity,
} from 'chainsmith-sdk/src/types';
import { StateEventRegistry } from '../types';
import { ConnectedWallet } from '@privy-io/react-auth';
import { BackgroundChains, CurrentNativeChain } from '../chainsmith';

export enum BackgroundVariant {
  Image = 'Background Image',
  Color = 'Background Color',
}

export const defaultActivityStats: TActivityStats = {
  totalTxs: 0,
  firstActiveDay: null,
  uniqueActiveDays: 0,
  longestStreakDays: 0,
  currentStreakDays: 0,
  activityPeriod: 0,
};

export const defaultTokenPortfolioStats: TTokenPortfolioStats = {
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
  stateEvents: StateEventRegistry;
  setStateEvents: SetState<StateEventRegistry>;

  userWallet: UseState<ConnectedWallet | undefined>;
  agentWallet: UseState<ConnectedWallet | undefined>;

  // Networks
  selectedNetworks: UseState<TMultiEcosystem<TChainName[]>>;
  currentNativeChain: UseState<TChainName>;

  // Special name service
  oneID: UseState<string>;

  // Raw
  allTransactions: UseState<TMultichain<TTokenTransferActivity[]>>;
  tokenPortfolio: UseState<TTokenPortfolio>;

  // Insights
  chainStats: UseState<TChainStats>;
  activityStats: UseState<TMultichain<TActivityStats>>;
  tokenPortfolioStats: UseState<TTokenPortfolioStats>;
  totalGasInETH: UseState<number>;
}

export const MagicContext = React.createContext<IMagicContext>(undefined as any);

interface Props {
  children: React.ReactElement | React.ReactNode;
}

export const MagicProvider = ({ children }: Props) => {
  const currentNativeChain = useState<TChainName>(CurrentNativeChain);
  const selectedNetworks = useState<TMultiEcosystem<TChainName[]>>({
    evm: BackgroundChains,
  });
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});

  const userWallet = useState<ConnectedWallet | undefined>(undefined);
  const agentWallet = useState<ConnectedWallet | undefined>(undefined);
  const oneID = useState('');

  const appStage = useState<AppStage>(AppStage.DisplayProfile);
  // All transactions and activity stats
  const allTransactions = useState<TMultichain<TTokenTransferActivity[]>>({});
  const activityStats = useState<TMultichain<TActivityStats>>({});
  const chainStats = useState<TChainStats>(defaultChainStats);

  // Multi-chain token portfolio
  const tokenPortfolio = useState<TTokenPortfolio>({
    aggregatedBalanceByChain: {},
    aggregatedBalanceByToken: {},
    chainRecordsWithTokens: {},
    totalUsdValue: 0,
  });
  const tokenPortfolioStats = useState<TTokenPortfolioStats>(defaultTokenPortfolioStats);
  const totalGasInETH = useState(0);

  return (
    <MagicContext.Provider
      value={{
        appStage,
        stateEvents,
        setStateEvents,
        selectedNetworks,
        currentNativeChain,

        userWallet,
        agentWallet,
        // Raw
        oneID,
        tokenPortfolio,
        tokenPortfolioStats,
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
