import { PublicClient } from 'viem';
import type { TChain } from './chains.d.ts';

export interface TCreateClientParameters {
  chain: TChain;
  config?: Partial<{
    batchSize: number;
    rpcUrl: string;
  }>;
}

export type TClient = PublicClient & {
  chain: TChain;
};
