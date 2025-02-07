import { autoInjectable } from 'tsyringe';
import {
  IMultichain,
  TAddress,
  TChain,
  TClient,
  TContractToken,
  TMarketToken,
  TNativeToken,
  TToken,
  TTokenAddress,
  TTokenTransferActivity,
} from '../../types';
import { EvmTokenPlugin } from './evm';
import { formatReadableToken } from '../../wrapper';
import { Logger } from 'tslog';
import { getClientChain } from '../../utils';
import { IMarketDataAdapter, IOnchainActivityAdapter, WithAdapter } from '../../adapters/adapter';
import { StoragePlugin } from '../storage';

type IGetTokenPrice = (client?: TClient, tokenAddress?: TTokenAddress) => Promise<TMarketToken>;
type IGetMultichainTokenActivities = (
  chains?: TChain[],
  address?: TAddress
) => Promise<IMultichain<TTokenTransferActivity[]>>;

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

  getTokenPrice: WithAdapter<IMarketDataAdapter, IGetTokenPrice> =
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

  listTokenTransferActivities: WithAdapter<IOnchainActivityAdapter, IGetMultichainTokenActivities> =
    adapter => async (chains?: TChain[], walletAddress?: TAddress) => {
      try {
        const chainActivitiesRecord: IMultichain<TTokenTransferActivity[]> = {};
        for (const chain of this.storagePlugin.readDiskOrReturn({ chains })) {
          chainActivitiesRecord[chain.chainName] = adapter.listAllTokenActivities(
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
