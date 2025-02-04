import { PublicClient } from 'viem';
import { TChain } from './chains';

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
