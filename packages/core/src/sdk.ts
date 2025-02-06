import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import {
  MultichainPortfolioPlugin,
  MultichainTokenPlugin,
  MultiPlatformSocialPlugin,
} from './plugins';
import { TChain } from './types';
import { StoragePlugin } from './plugins/memory';

@singleton()
export default class ChainsmithSdk {
  constructor(
    public portfolio: MultichainPortfolioPlugin,
    public token: MultichainTokenPlugin,
    public social: MultiPlatformSocialPlugin,
    public storage: StoragePlugin
  ) {}
}

export const initializeSdk = (chains?: TChain[]) => {
  const sdk = container.resolve(ChainsmithSdk);
  if (chains) sdk.storage.writeToDisk('chains', chains);
  return sdk;
};
