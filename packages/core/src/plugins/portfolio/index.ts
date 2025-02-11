import { Logger } from 'tslog';
import { autoInjectable } from 'tsyringe';
import type {
  IMarketDataAdapter,
  IOnchainTokenAdapter,
  WithAdapter,
} from '../../types/adapter.d.ts';
import type { TAddress, TChain, TChainTokenList, TMultichain } from '../../types/index.d.ts';
import { createClient } from '../../wrapper.ts';
import { StoragePlugin } from '../storage/index.ts';
import { MultichainTokenPlugin } from '../token/index.ts';
import { aggregateMultichainTokenBalance } from '../../utils/portfolio.util.ts';
import type {
  IGetMultichainTokenPortfolio,
  TGetChainTokenList,
  TGetMultichainTokenList,
} from './types.d.ts';

@autoInjectable()
export class MultichainPortfolioPlugin {
  logger = new Logger({ name: 'MultichainPortfolioPlugin' });

  constructor(
    private tokenPlugin: MultichainTokenPlugin,
    private storage: StoragePlugin
  ) {}

  getMultichainTokenList: WithAdapter<
    [IMarketDataAdapter, IOnchainTokenAdapter],
    TGetMultichainTokenList
  > = adapters => async (walletAddress?: TAddress, chains?: TChain[]) => {
    try {
      const tokenList: TMultichain<TChainTokenList> = {};
      for (const chain of this.storage.readDiskOrReturn({ chains })) {
        tokenList[chain.chainName] = await this.getChainTokenList(adapters)(
          chain,
          this.storage.readRamOrReturn({ walletAddress })
        );
      }
      return tokenList;
    } catch (error: any) {
      this.logger.error(`Failed to get multichain token portfolio: ${error}`);
      throw new Error(error);
    }
  };

  getMultichainTokenPortfolio: WithAdapter<
    [IMarketDataAdapter, IOnchainTokenAdapter],
    IGetMultichainTokenPortfolio
  > = adapters => async (walletAddress?: TAddress, chains?: TChain[]) => {
    try {
      const multichainTokenList = await this.getMultichainTokenList(adapters)(
        walletAddress,
        chains
      );
      return aggregateMultichainTokenBalance(multichainTokenList);
    } catch (error: any) {
      this.logger.error(`Failed to get multichain token portfolio: ${error}`);
      throw new Error(error);
    }
  };

  getChainTokenList: WithAdapter<[IMarketDataAdapter, IOnchainTokenAdapter], TGetChainTokenList> =
    ([marketDataAdapter, onchainTokenAdapter]) =>
    async (chain: TChain, address: TAddress): Promise<TChainTokenList> => {
      try {
        const client = createClient({
          chain,
        });
        if (!marketDataAdapter || !onchainTokenAdapter) throw new Error('No adapter found');
        const nativeToken = await this.tokenPlugin.getNativeToken(client, address);
        const contractTokens = await this.tokenPlugin.getContractTokens(onchainTokenAdapter)(
          chain.chainName,
          address
        );
        const tokens = [nativeToken, ...contractTokens];
        const marketData = await marketDataAdapter.fetchTokensWithPrice(chain.chainName, tokens);
        return {
          tokens: marketData.tokens,
          totalUsdValue: marketData.totalUsdValue,
        };
      } catch (error: any) {
        this.logger.error(`Failed to get chain token portfolio: ${error}`);
        throw new Error(error);
      }
    };
}
