import * as emvChains from 'viem/chains';
import ChainsmithSdk, { useChainsmithSdk } from './sdk';

export const EcosystemRegistry: Record<
  any,
  {
    name: string;
    chains: any;
  }
> = {
  evm: {
    name: 'Ethereum Virtual Machine (EVM)',
    chains: emvChains,
  },
  svm: {
    name: 'Solana Virtual Machine (SVM)',
    chains: [],
  },
  other: {
    name: 'Other Ecosystem',
    chains: [],
  },
};

export const Ecosystems: any[] = Object.keys(EcosystemRegistry) as any;

export { ChainsmithSdk, useChainsmithSdk };
