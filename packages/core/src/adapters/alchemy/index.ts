import { autoInjectable } from 'tsyringe';
import type { IOnchainTokenAdapter } from '../../types/adapter.d.ts';
import type { TChainName, TAddress } from '../../types/chains.d.ts';
import type { TContractToken } from '../../types/tokens.d.ts';
import type { TAlchemyRequest, TAlchemyResponse } from './types.d.ts';
import { EvmTokenPlugin } from '../../plugins/token/evm.ts';
import { getChainByName } from '../../utils/chain.util.ts';
import { alchemy } from '../../rpc/index.ts';

@autoInjectable()
export class AlchemyAdapter implements IOnchainTokenAdapter {
  name = 'AlchemyAdapter';

  apiKey: string;

  constructor(
    apiKey: string,
    private evmPlugin: EvmTokenPlugin
  ) {
    this.apiKey = apiKey;
  }

  async listAllOwnedTokens(chainName: TChainName, address: TAddress): Promise<TContractToken[]> {
    const chain = getChainByName(chainName);
    // Note: let the maxCount=100 by default
    const req: TAlchemyRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [address],
    };
    const data = await fetch(`/api/alchemy?chain=${chain.chainName}`, {
      method: 'POST',
      body: JSON.stringify(req),
    });

    const res = await fetch(alchemy(this.apiKey)(chain), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
      },
      body: JSON.stringify(req),
    });

    const alchemyRes: TAlchemyResponse = await res.json();
    const tokenBalances = alchemyRes.result.tokenBalances || [];

    const alchemyChainMapping: Partial<Record<TChainName, string>> = {
      mainnet: 'eth',
      base: 'base',
      optimism: 'op',
      arbitrum: 'arb',
    };
    const tokenMetadatas = await this.evmPlugin.getTokenMetadataList(
      alchemyChainMapping[chain.chainName] as string
    );

    const parsedTokenBalance = tokenBalances.map<TContractToken>(token => {
      const metadata = tokenMetadatas.find(metadata => metadata.address === token.contractAddress);
      if (metadata) {
        return {
          chainId: chain.id,
          name: metadata.name,
          symbol: metadata.symbol,
          logoURI: metadata.logoURI,
          decimals: metadata.decimals,
          balance: Number.parseInt(token.tokenBalance, 16) / 10 ** metadata.decimals,
          address: token.contractAddress as any,
          type: 'contract',
        };
      }
      return null;
    });

    // Only get token with metadata
    return parsedTokenBalance.filter(token => token !== null);
  }
}
