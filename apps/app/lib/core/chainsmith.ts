import { IEcosystemChainRegistry } from 'chainsmith/src/types';

export const LocalEcosystemRegistry: IEcosystemChainRegistry = {
  evm: {
    chains: ['base', 'mainnet', 'abstract', 'sonic', 'zksync'],
  },
  svm: {
    chains: [],
  },
  other: {
    chains: [],
  },
};
