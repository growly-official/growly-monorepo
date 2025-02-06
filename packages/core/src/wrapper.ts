import { createPublicClient, formatEther, http } from 'viem';
import {
  TChain,
  TChainEcosystem,
  TBaseChain,
  TCreateClientParameters,
  TClient,
  TChainName,
} from './types';

const DEFAULT_MULTICAL_BATCH_SIZE = 32 * 1026;

export function createClient({ chain, config }: TCreateClientParameters): TClient {
  if (chain.ecosystem === 'evm') {
    const transport = http(config?.rpcUrl || chain.rpcUrls.default.http?.[0] || '', {
      onFetchRequest(request) {
        console.log('URL: ', request.url);
      },
    });
    return createPublicClient({
      chain,
      transport,
      batch: {
        multicall: {
          batchSize: config?.batchSize || DEFAULT_MULTICAL_BATCH_SIZE,
        },
      },
    }) as any;
  } else {
    return undefined as any;
  }
}

export function formatReadableToken(chain: TBaseChain, balance: bigint): number {
  if (chain.ecosystem === 'evm') return parseFloat(formatEther(balance));
  return parseFloat(balance.toString());
}

export class ChainTypeBuilder {
  chain: TBaseChain;

  constructor(chain: TBaseChain) {
    this.chain = chain as any;
  }

  withChainName = (name: TChainName): ChainTypeBuilder => {
    this.chain.chainName = name;
    return this;
  };

  withRpcUrl = (url: string): ChainTypeBuilder => {
    this.chain.rpcUrls.default = {
      ...this.chain.rpcUrls.default,
      http: [url],
    };
    return this;
  };

  withEcosystem = (ecosystem: TChainEcosystem): ChainTypeBuilder => {
    this.chain.ecosystem = ecosystem;
    return this;
  };

  build = (): TChain => {
    return this.chain as TChain;
  };
}
