import * as utils from './utils';
import * as services from './plugins';
import ChainsmithSdk from './sdk';
import { ChainTypeBuilder } from './wrapper';
import { EvmChainList } from './data';
import { TChainEcosystem } from './types';
export type * as Types from './types';
export * from './rpc';
export * from './wrapper';
export * from './utils';

const mainnet = new ChainTypeBuilder(EvmChainList.mainnet).withEcosystem('evm').build();

const evmChains = utils.iterateObject(
  {
    ...EvmChainList,
    mainnet,
  },
  (_, item) => item
);

export const EcosystemRegistry: Record<
  TChainEcosystem,
  {
    name: string;
    chains: EvmChainList.Chain[];
  }
> = {
  evm: {
    name: 'Ethereum Virtual Machine (EVM)',
    chains: evmChains,
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

export const Ecosystems: TChainEcosystem[] = Object.keys(EcosystemRegistry) as any;

export { utils, services, ChainsmithSdk };
