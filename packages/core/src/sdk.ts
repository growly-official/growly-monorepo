import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import { mainnet } from 'viem/chains';
import { MultichainPortfolioPlugin, MultichainTokenPlugin, TPlugin } from './plugins';
import { TChain } from './types';

@singleton()
export default class ChainsmithSdk {
  chain: TChain = { ...mainnet, ecosystem: 'evm', chainName: 'mainnet' };
  plugins: TPlugin[] = [];

  constructor(
    public portfolio: MultichainPortfolioPlugin,
    public token: MultichainTokenPlugin
  ) {
    this.plugins = [portfolio, token];
  }
}

export const initializeSdk = () => {
  return container.resolve(ChainsmithSdk);
};

export const useChainsmithSdk = () => {
  return initializeSdk();
};
