import { autoInjectable } from 'tsyringe';
import {
  TAddress,
  TChainName,
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

type IGetTokenPrice = (client: TClient, tokenAddress: TTokenAddress) => Promise<TMarketToken>;
type IGetTokenActivities = (
  chain: TChainName,
  address: TAddress
) => Promise<TTokenTransferActivity[]>;

@autoInjectable()
export class MultichainTokenPlugin {
  logger = new Logger({ name: 'MultichainTokenPlugin' });

  constructor(private evmTokenPlugin: EvmTokenPlugin) {}

  getTokenPrice: WithAdapter<IMarketDataAdapter, IGetTokenPrice> =
    adapter => async (client: TClient, tokenAddress: TAddress) => {
      try {
        const chain = getClientChain(client);
        return adapter.fetchTokenWithPrice(chain.chainName!, { address: tokenAddress } as TToken);
      } catch (error: any) {
        this.logger.error(`Failed to get token price: ${error.message}`);
        throw new Error(error);
      }
    };

  listTokenTransferActivities: WithAdapter<IOnchainActivityAdapter, IGetTokenActivities> =
    adapter => async (chain: TChainName, address: TAddress) => {
      try {
        return adapter.listAllTokenActivities(chain, address, 100);
      } catch (error: any) {
        this.logger.error(`Failed to get token activities: ${error.message}`);
        throw new Error(error);
      }
    };

  async getNativeToken(client: TClient, address: TAddress): Promise<TNativeToken> {
    try {
      const chain = getClientChain(client);
      const balance = await client.getBalance({
        address: address as any,
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

  async getContractTokens(client: TClient, address: TAddress): Promise<TContractToken[]> {
    try {
      const chain = getClientChain(client);
      const tokenList = await this.evmTokenPlugin.getTokenMetadataList(chain.id);
      return this.evmTokenPlugin.getBatchLatestTokens(client, tokenList, address);
    } catch (error: any) {
      this.logger.error(`Failed to get contract tokens: ${error.message}`);
      throw new Error(error);
    }
  }
}
