import { ChainId, CoinKey, EVM, createConfig, getQuote, getRoutes } from '@lifi/sdk';
import type { TClient } from '../../types/client.d.ts';
import type { TAddress, TChainName } from '../../types/chains.d.ts';
import type { TTokenSymbol } from '../../types/tokens.d.ts';
import { getChainByName } from '../../utils/chain.util.ts';
import { EvmTokenPlugin, StoragePlugin } from '../../plugins/index.ts';

export class LifiAdapter {
  apiKey: string | undefined;
  apiUrl: string = 'https://li.quest/v1';

  constructor(
    apiKey: string | undefined,
    apiUrl: string | undefined,
    private storagePlugin: StoragePlugin,
    private emvPlugin: EvmTokenPlugin
  ) {
    if (apiKey) this.apiKey = apiKey;
    if (apiUrl) this.apiUrl = apiUrl;
  }

  async createCrosschainSwap(
    walletAddress: TAddress,
    fromChain: TChainName,
    fromToken: TTokenSymbol,
    toChain: TChainName,
    toToken: TTokenSymbol,
    fromAmount: number
  ) {
    createConfig({
      integrator: 'Growly:LifiAdapter',
      apiKey: this.apiKey,
      apiUrl: this.apiUrl,
      rpcUrls: this.storagePlugin.readDisk('chainRpcUrls'),
    });

    const fromChainId = getChainByName(fromChain).id;
    const toChainId = getChainByName(toChain).id;
    const fromTokenMetadata = await this.emvPlugin.getTokenMetadataBySymbol(fromChainId, fromToken);
    const toTokenMetadata = await this.emvPlugin.getTokenMetadataBySymbol(toChainId, toToken);
    const quote = await getQuote({
      fromAddress: walletAddress,
      fromChain: fromChainId,
      toChain: toChainId,
      fromToken: fromTokenMetadata.address,
      toToken: toTokenMetadata.address,
      fromAmount: fromAmount.toString(),
    });
  }
}
