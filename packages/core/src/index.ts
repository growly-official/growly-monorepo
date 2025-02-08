import 'reflect-metadata';
import * as utils from './utils/index.ts';
import { ChainTypeBuilder } from './wrapper.ts';
import { EvmChainList } from './data/index.ts';
import type { IEcosystemRegistry, TChainEcosystem } from './types/index.d.ts';
// Exports.
export * as adapters from './adapters/index.ts';
export * as plugins from './plugins/index.ts';
export { default as ChainsmithSdk } from './sdk.ts';
export * as rpc from './rpc/index.ts';
export * as wrapper from './wrapper.ts';

const mainnet = new ChainTypeBuilder(EvmChainList.mainnet).withEcosystem('evm').build();

const evmChains = utils.iterateObject(
  {
    ...EvmChainList,
    mainnet,
  },
  (_, item) => item
);

export const EcosystemRegistry: IEcosystemRegistry = {
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
