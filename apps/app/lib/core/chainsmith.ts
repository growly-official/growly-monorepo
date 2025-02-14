import { IEcosystemChainRegistry, TChainName } from 'chainsmith/src/types';

export const LocalEvmSupportedChains: TChainName[] = ['mainnet', 'base', 'optimism', 'arbitrum'];
export const LocalEcosystemRegistry: IEcosystemChainRegistry = {
  evm: {
    chains: LocalEvmSupportedChains,
  },
  svm: {
    chains: [],
  },
  other: {
    chains: [],
  },
};
