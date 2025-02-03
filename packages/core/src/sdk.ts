import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import { Chain, mainnet } from 'viem/chains';

@singleton()
export default class ChainsmithSdk {
  chain: Chain = mainnet;
  plugins: any[] = [];

  constructor() {}
}

export const initializeSdk = () => {
  return container.resolve(ChainsmithSdk);
};

export const useChainsmithSdk = () => {
  return initializeSdk();
};
