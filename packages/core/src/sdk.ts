import { container, singleton } from 'tsyringe';
import {
  MultichainPortfolioPlugin,
  MultichainTokenPlugin,
  MultiPlatformSocialPlugin,
  StoragePlugin,
  EvmTokenPlugin,
  EvmChainPlugin,
} from './plugins/index.ts';
import type { TChain } from './types/index.d.ts';

@singleton()
export default class ChainsmithSdk {
  constructor(
    public portfolio: MultichainPortfolioPlugin,
    public token: MultichainTokenPlugin,
    public social: MultiPlatformSocialPlugin,
    public storage: StoragePlugin,
    public evmToken: EvmTokenPlugin,
    public evmChain: EvmChainPlugin
  ) {}

  public static init(chains?: TChain[]) {
    const sdk = container.resolve(ChainsmithSdk);
    sdk.storage.reset();
    if (chains) {
      sdk.storage.writeToDisk('chains', chains);

      let rpcUrls = {};
      for (const chain of chains) {
        if (!chain.rpcUrls.default.http[0])
          throw new Error(`No RPC URL found for ${chain.chainName}`);
        rpcUrls = {
          ...rpcUrls,
          [chain.id]: chain.rpcUrls.default.http[0],
        };
      }
      sdk.storage.writeToDisk('chainRpcUrls', rpcUrls);
    }
    return sdk;
  }
}
