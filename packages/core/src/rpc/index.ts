import { EvmChainList } from '../data';
import { TBaseChain } from '../types';

const ALCHEMY_CHAIN_ENDPOINT = {
  [EvmChainList.mainnet.id]: 'https://eth-mainnet.g.alchemy.com',
  [EvmChainList.base.id]: 'https://base-mainnet.g.alchemy.com',
  [EvmChainList.polygon.id]: 'https://polygon-mainnet.g.alchemy.com',
};

export type GetChainRpcEndpoint = (chain: TBaseChain) => string;

export const alchemy: (apiKey: string) => GetChainRpcEndpoint = (apiKey: string) => chain => {
  const endpoint = (ALCHEMY_CHAIN_ENDPOINT as any)[chain.id];
  if (!endpoint) throw new Error('Invalid chain ID');
  return `${endpoint}/v2/${apiKey}`;
};
