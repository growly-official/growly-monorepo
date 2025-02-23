import { IEcosystemChainRegistry, TChainName } from 'chainsmith-sdk/src/types';

export const BackgroundChains: TChainName[] = ['mainnet', 'base', 'optimism', 'arbitrum'];

export const CurrentNativeChain: TChainName = 'sonic';

export const LocalEcosystemRegistry: IEcosystemChainRegistry = {
  evm: {
    chains: BackgroundChains,
  },
  svm: {
    chains: [],
  },
  other: {
    chains: [],
  },
};
