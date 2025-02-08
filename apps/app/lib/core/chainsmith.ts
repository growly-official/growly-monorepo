import { IEcosystemChainRegistry } from 'chainsmith/src/types';

export const LocalEcosystemRegistry: IEcosystemChainRegistry = {
  evm: {
    chains: ['base', 'mainnet', 'optimism', 'zksync', 'baseSepolia'],
  },
  svm: {
    chains: [],
  },
  other: {
    chains: [],
  },
};
