import { MultichainTokenPlugin } from '../token/index.ts';
import type { TMultichain, TAddress, TChain, TChainTokenData } from '../../types/index.d.ts';
import { createClient } from '../../wrapper.ts';
import { Logger } from 'tslog';
import { autoInjectable } from 'tsyringe';
import type { IMarketDataAdapter, WithAdapter } from '../../types/adapter.d.ts';
import { Disk, Ram, StoragePlugin } from '../storage/index.ts';

type WithRamExist<F extends string, T> = Ram[F] extends undefined ? void : T;
type WithDiskExist<F extends keyof Disk, T> = Disk[F] extends undefined ? void : T;

type TGetMultichainPortfolio = (
  walletAddress?: WithRamExist<'walletAddress', TAddress>,
  chains?: WithDiskExist<'chains', TChain[]>
) => Promise<TMultichain<TChainTokenData>>;

type TGetChainPortfolio = (chain: TChain, address: TAddress) => Promise<TChainTokenData>;

@autoInjectable()
export class MultichainPortfolioPlugin {
  logger = new Logger({ name: 'MultichainPortfolioPlugin' });

  constructor(
    private tokenPlugin: MultichainTokenPlugin,
    private storage: StoragePlugin
  ) {}

  getMultichainTokenPortfolio: WithAdapter<IMarketDataAdapter, TGetMultichainPortfolio> =
    adapter =>
    async (
      walletAddress?: WithRamExist<'walletAddress', TAddress>,
      chains?: WithDiskExist<'chains', TChain[]>
    ) => {
      try {
        const portfolio: TMultichain<TChainTokenData> = {};
        for (const chain of this.storage.readDiskOrReturn({ chains })) {
          portfolio[chain.chainName] = await this.getChainTokenPortfolio(adapter)(
            chain,
            this.storage.readRamOrReturn({ walletAddress })
          );
        }
        return portfolio;
      } catch (error: any) {
        this.logger.error(`Failed to get multichain token portfolio: ${error}`);
        throw new Error(error);
      }
    };

  getChainTokenPortfolio: WithAdapter<IMarketDataAdapter, TGetChainPortfolio> =
    adapter =>
    async (chain: TChain, address: TAddress): Promise<TChainTokenData> => {
      try {
        const client = createClient({
          chain,
        });
        if (!adapter) throw new Error('No adapter found');
        const nativeToken = await this.tokenPlugin.getNativeToken(client, address);
        const contractTokens = await this.tokenPlugin.getContractTokens(client, address);
        const tokens = [nativeToken, ...contractTokens];
        const marketData = await adapter.fetchTokensWithPrice(chain.chainName, tokens);
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
