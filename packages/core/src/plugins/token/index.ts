import { autoInjectable } from 'tsyringe';
import type {
  TMultichain,
  TAddress,
  TChain,
  TClient,
  TContractToken,
  TMarketToken,
  TNativeToken,
  TToken,
  TTokenAddress,
  TTokenTransferActivity,
} from '../../types/index.d.ts';
import { EvmTokenPlugin } from './evm.ts';
import { formatReadableToken } from '../../wrapper.ts';
import { Logger } from 'tslog';
import { getClientChain } from '../../utils/index.ts';
import type {
  IMarketDataAdapter,
  IOnchainActivityAdapter,
  WithAdapter,
} from '../../types/adapter.d.ts';
import { StoragePlugin } from '../storage/index.ts';

type TGetTokenPrice = (client?: TClient, tokenAddress?: TTokenAddress) => Promise<TMarketToken>;
type TGetMultichainTokenActivities = (
  address?: TAddress,
  chains?: TChain[]
) => Promise<TMultichain<TTokenTransferActivity[]>>;

@autoInjectable()
export class MultichainTokenPlugin {
  logger = new Logger({ name: 'MultichainTokenPlugin' });

  constructor(
    private evmTokenPlugin: EvmTokenPlugin,
    private storagePlugin: StoragePlugin<{
      client: TClient;
      walletAddress: TAddress;
      tokenAddress: TAddress;
    }>
  ) {}

  getTokenPrice: WithAdapter<IMarketDataAdapter, TGetTokenPrice> =
    adapter => async (client?: TClient, tokenAddress?: TAddress) => {
      try {
        const chain = getClientChain(this.storagePlugin.readRamOrReturn({ client }));
        return adapter.fetchTokenWithPrice(chain.chainName!, {
          address: this.storagePlugin.readRamOrReturn({ tokenAddress }),
        } as TToken);
      } catch (error: any) {
        this.logger.error(`Failed to get token price: ${error.message}`);
        throw new Error(error);
      }
    };

  listMultichainTokenTransferActivities: WithAdapter<
    IOnchainActivityAdapter,
    TGetMultichainTokenActivities
  > = adapter => async (walletAddress?: TAddress, chains?: TChain[]) => {
    try {
      const chainActivitiesRecord: TMultichain<TTokenTransferActivity[]> = {};
      for (const chain of this.storagePlugin.readDiskOrReturn({ chains })) {
        chainActivitiesRecord[chain.chainName] = await adapter.listAllTokenActivities(
          chain.chainName,
          this.storagePlugin.readRamOrReturn({ walletAddress }),
          100
        );
      }
      return chainActivitiesRecord;
    } catch (error: any) {
      this.logger.error(`Failed to get token activities: ${error.message}`);
      throw new Error(error);
    }
  };

  async getNativeToken(client: TClient, walletAddress?: TAddress): Promise<TNativeToken> {
    try {
      const chain = getClientChain(client);
      const balance = await client.getBalance({
        address: this.storagePlugin.readRamOrReturn({ walletAddress }),
      });
      return {
        ...chain.nativeCurrency,
        chainId: chain.id,
        type: 'native',
        balance: formatReadableToken(chain, balance),
      };
    } catch (error: any) {
      this.logger.error(`Failed to get native token: ${error.message}`);
      throw new Error(error);
    }
  }

  async getContractTokens(client: TClient, walletAddress?: TAddress): Promise<TContractToken[]> {
    try {
      const chain = getClientChain(client);
      const tokenList = await this.evmTokenPlugin.getTokenMetadataList(chain.id);
      return this.evmTokenPlugin.getBatchLatestTokens(
        client,
        tokenList,
        this.storagePlugin.readRamOrReturn({ walletAddress })
      );
    } catch (error: any) {
      this.logger.error(`Failed to get contract tokens: ${error.message}`);
      throw new Error(error);
    }
  }
}
