import { IEcosystemChainRegistry } from 'chainsmith/src/types';

export const LocalEcosystemRegistry: IEcosystemChainRegistry = {
  evm: {
    chains: ['mainnet', 'base'],
  },
  svm: {
    chains: [],
  },
  other: {
    chains: [],
  },
};
