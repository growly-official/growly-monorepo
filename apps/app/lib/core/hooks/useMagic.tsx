import { calculateMultichainTokenPortfolio } from 'chainsmith/src/utils';
import { toast } from 'react-toastify';
import { delayMs, setState } from '../utils';
import {
  calculateEVMStreaksAndMetrics,
  calculateGasInETH,
  calculateTokenActivityStats,
  findLongestHoldingToken,
} from '../../helpers/activity.helper';
import {
  getMultichainPortfolio,
  listAllTokenActivityByChain,
  listAllTransactionsByChain,
} from '../api/services';
import {
  BinaryState,
  StateEvent,
  StateOption,
  ThreeStageState,
  Toastable,
} from '../types/state.type';
import { useMagicContext } from './useMagicContext';
import { TAddress, TChainStats } from 'chainsmith/src/types';
import { TEVMScanTransaction } from 'chainsmith/src/adapters/evmscan/types';

export const StateSubEvents = {
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
  [StateEvent.GetNftPortfolio]: ThreeStageState,
  [StateEvent.GetTokenActivity]: ThreeStageState,
  [StateEvent.GetNftActivity]: ThreeStageState,
  [StateEvent.GetTalentScore]: BinaryState,
};

export const useMagic = () => {
  const magicContext = useMagicContext();
  const {
    stateEvents,
    setStateEvents,
    // Raw
    allTransactions,
    tokenPortfolio,
    tokenActivity,

    // Insights
    chainStats,
    activityStats,
    tokenPortfolioStats,
    totalGasInETH,
  } = magicContext;

  const dispatchStateEvent = (eventName: StateEvent, status: StateOption) => {
    setStateEvents(stateEvents => ({ ...stateEvents, [eventName]: status }));
  };

  const stateCheck = (event: keyof typeof StateEvent, option: StateOption): boolean => {
    return stateEvents[event] === (StateSubEvents[event] as any)[option];
  };

  async function newAsyncDispatch<Output>(
    eventName: StateEvent,
    eventHooks: {
      onStartEvent: StateOption;
      onFinishEvent: Toastable<StateOption>;
      onErrorEvent: Toastable<StateOption>;
      onResetEvent: StateOption;
    },
    method: () => Promise<Output>
  ): Promise<Output> {
    dispatchStateEvent(eventName, eventHooks.onResetEvent);
    dispatchStateEvent(eventName, eventHooks.onStartEvent);
    try {
      const data = await method();
      const event = eventHooks.onFinishEvent;
      dispatchStateEvent(eventName, event.value);
      if (event.toast) {
        toast(event.toast, {
          type: 'success',
        });
      }
      return data;
    } catch (error: any) {
      const event = eventHooks.onErrorEvent;
      dispatchStateEvent(eventName, event.value);
      if (event.toast) {
        toast(`${event.toast} - Error: ${error.message}`, {
          type: 'error',
        });
      }
      throw new Error(`${eventName} : ${error.message}`);
    }
  }

  const fetchActivityStats = async (addressInput: TAddress) => {
    return newAsyncDispatch(
      StateEvent.ActivityStats,
      {
        onStartEvent: StateSubEvents.ActivityStats.InProgress,
        onErrorEvent: { value: StateSubEvents.ActivityStats.Idle },
        onFinishEvent: {
          value: StateSubEvents.ActivityStats.Finished,
          toast: 'Activity stats fetched.',
        },
        onResetEvent: StateSubEvents.ActivityStats.Idle,
      },
      async () => {
        const data = await listAllTransactionsByChain(addressInput);
        const _allTransactions = Object.values(data).flatMap(d => d.txs);
        setState(allTransactions)(_allTransactions);
        // console.log("_allTransactions", _allTransactions);

        const ethNativeTransactions: TEVMScanTransaction[] = Object.entries(data)
          .filter(([key, _]) => key !== 'vic') // exclude VIC since it's a zero-gas fee (VN proud)
          .flatMap(([_, value]) => value.txs);

        const filteredTransactions = ethNativeTransactions.filter(
          tx => tx.from.toLowerCase() === addressInput.toLowerCase()
        );

        const _totalGasInETH = filteredTransactions.reduce(
          (acc, curr) =>
            acc + calculateGasInETH(Number.parseInt(curr.gasUsed), Number.parseInt(curr.gasPrice)),
          0
        );

        // console.log("_totalGasInETH:", _totalGasInETH);
        setState(totalGasInETH)(_totalGasInETH);

        let mostActiveChainID = Object.keys(data).reduce((a, b) =>
          data[a].txs.length > data[b].txs.length ? a : b
        );

        if (data[mostActiveChainID].txs.length === 0) {
          mostActiveChainID = 'base'; // Default chain should be 'Base'
        }

        const mostActiveChainName = data[mostActiveChainID].chainName;
        const _countActiveChainTxs = data[mostActiveChainID].txs.length;

        // Get Activity Stats
        const stats = calculateEVMStreaksAndMetrics(_allTransactions, addressInput);
        // console.log("Activity Stats:", stats);
        setState(activityStats)(stats);

        // Get chain stats
        const totalChains = Object.keys(data);
        const noActivityChains = totalChains.filter(chain => data[chain].txs.length === 0);
        // Get unique active day, on most active chain 🫠
        const { uniqueActiveDays } = calculateEVMStreaksAndMetrics(
          data[mostActiveChainID].txs,
          addressInput
        );

        const _chainStats: TChainStats = {
          totalChains,
          mostActiveChainName,
          mostActiveChainID,
          noActivityChains,
          countUniqueDaysActiveChain: uniqueActiveDays,
          countActiveChainTxs: _countActiveChainTxs,
        };
        // console.log("Chain stats:", _chainStats);
        setState(chainStats)(_chainStats);

        return stats;
      }
    );
  };

  const fetchMultichainTokenPortfolio = async (addressInput: TAddress) => {
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: StateSubEvents.GetTokenPortfolio.InProgress,
        onErrorEvent: {
          value: StateSubEvents.GetTokenPortfolio.Idle,
          toast: 'Failed to fetch multichain token portfolio.',
        },
        onFinishEvent: {
          value: StateSubEvents.GetTokenPortfolio.Finished,
          toast: 'Fetched token portfolio.',
        },
        onResetEvent: StateSubEvents.GetTokenPortfolio.Idle,
      },
      async () => {
        const tokenBalanceData = await getMultichainPortfolio(addressInput);

        // Get distinct token symbol with non-zero balance
        const distinctTokenSymbols = [
          ...new Set(
            tokenBalanceData.filter(token => token.tokenBalance !== 0).map(token => token.symbol)
          ),
        ];
        // Get token price
        const _marketData = await listCMCTokenDetail(distinctTokenSymbols.join(','));
        // console.log("Price market data:", _marketData);
        setState(marketData)(_marketData);
        // console.log("tokenBalanceData", tokenBalanceData);
        setState(tokenPortfolio)(tokenBalanceData);

        const _tokenPortfolioStats = calculateMultichainTokenPortfolio(
          tokenBalanceData,
          _marketData
        );
        // console.log("_tokenPortfolioStats", _tokenPortfolioStats);
        setState(tokenPortfolioStats)(_tokenPortfolioStats);
        return MultiAssetsPortfolio;
      }
    );
  };

  const fetchMultichainTokenActivity = async (addressInput: string) => {
    return newAsyncDispatch(
      StateEvent.GetTokenActivity,
      {
        onStartEvent: StateSubEvents.GetTokenActivity.InProgress,
        onErrorEvent: {
          value: StateSubEvents.GetTokenActivity.Idle,
          toast: 'Failed to fetch multichain token activities.',
        },
        onFinishEvent: {
          value: StateSubEvents.GetTokenActivity.Finished,
          toast: 'Fetched token activities.',
        },
        onResetEvent: StateSubEvents.GetTokenActivity.Idle,
      },
      async () => {
        const tokenActivityData = await listAllTokenActivityByChain(addressInput);
        const allTokenActivities = Object.values(tokenActivityData).flat();
        // console.log("allTokenActivities:", allTokenActivities);
        setState(tokenActivity)(allTokenActivities);

        // Get longest holding assets
        const longestHoldingTokenByChain = Object.entries(tokenActivityData).map(
          ([chain, activities]) => {
            return findLongestHoldingToken(chain, activities, addressInput);
          }
        );

        // console.log("longestHoldingTokenByChain", longestHoldingTokenByChain);

        // TODO ---- Can we reuse the market data previously fetched?
        // Get distinct token symbol with non-zero balance
        const distinctTokenSymbols = [...new Set(allTokenActivities.map(token => token.symbol))];
        // console.log("distinctTokenSymbols", distinctTokenSymbols);

        // Get token price
        const marketData = await listCMCTokenDetail(distinctTokenSymbols.join(','));
        // End of TODO --------

        const _tokenActivityStats = calculateTokenActivityStats(allTokenActivities, marketData);

        // TODO: set tokenActivityStats
        setState(tokenActivityStats)(_tokenActivityStats);
        // console.log("tokenActivityStats:", _tokenActivityStats);
      }
    );
  };

  const letsDoSomeMagic = async (addressInput: TAddress) => {
    try {
      await fetchActivityStats(addressInput);
      await fetchMultichainTokenPortfolio(addressInput);
      await fetchMultichainTokenActivity(addressInput);
      await delayMs(1000);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    query: {
      fetchMultichainNftPortfolio,
      fetchActivityStats,
      fetchMultichainTokenPortfolio,
      fetchMultichainTokenActivity,
      stateCheck,
    },
    mutate: {
      letsDoSomeMagic,
      dispatchStateEvent,
      newAsyncDispatch,
    },
  };
};
