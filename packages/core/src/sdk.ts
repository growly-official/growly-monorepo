import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import { mainnet } from 'viem/chains';
import {
  MultichainPortfolioPlugin,
  MultichainTokenPlugin,
  MultiPlatformSocialPlugin,
  TPlugin,
} from './plugins';
import { TChain } from './types';

@singleton()
export default class ChainsmithSdk {
  chain: TChain = { ...mainnet, ecosystem: 'evm', chainName: 'mainnet' };
  plugins: TPlugin[] = [];

  constructor(
    public portfolio: MultichainPortfolioPlugin,
    public token: MultichainTokenPlugin,
    public social: MultiPlatformSocialPlugin
  ) {
    this.plugins = [portfolio, token, social];
  }
}

export const initializeSdk = () => {
  return container.resolve(ChainsmithSdk);
};

export const useChainsmithSdk = () => {
  return initializeSdk();
};
