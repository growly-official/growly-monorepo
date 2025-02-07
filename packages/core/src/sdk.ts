import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import {
  MultichainPortfolioPlugin,
  MultichainTokenPlugin,
  MultiPlatformSocialPlugin,
  StoragePlugin,
} from './plugins';
import { TChain } from './types';

@singleton()
export default class ChainsmithSdk {
  constructor(
    public portfolio: MultichainPortfolioPlugin,
    public token: MultichainTokenPlugin,
    public social: MultiPlatformSocialPlugin,
    public storage: StoragePlugin
  ) {}

  public static init(chains?: TChain[]) {
    const sdk = container.resolve(ChainsmithSdk);
    if (chains) sdk.storage.writeToDisk('chains', chains);
    return sdk;
  }
}
