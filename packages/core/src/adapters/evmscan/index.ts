import { Logger } from 'tslog';
import { TChainName, TAddress, TTokenTransferActivity } from '../../types';
import { getChainByName, objectToQueryString } from '../../utils';
import { IOnchainActivityAdapter } from '../adapter';
import { TEVMScanResponse, TEVMScanTokenActivity } from './types';
import axios from 'axios';
import { autoInjectable } from 'tsyringe';

type GetTokenActivityQueryOptions = {
  page: number;
  offset: number;
  endblock: number;
  startblock: number;
};

@autoInjectable()
export class EvmscanAdapter implements IOnchainActivityAdapter {
  name = 'EvmscanAdapter';
  logger = new Logger({ name: this.name });

  apiUrl: string;
  apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async listAllTokenActivities(
    chainName: TChainName,
    address: TAddress,
    limit: number
  ): Promise<TTokenTransferActivity[]> {
    if (address.length == 0) return [];

    const chain = getChainByName(chainName);
    chain.nativeCurrency.symbol;

    let tokenActivities: TEVMScanTokenActivity[] = [];

    let offset = 0;
    let previousResultCount = 0;

    while (true) {
      const evmScanResp = await this.getTokenActivities('tokentx', address, {
        offset,
      });
      const currentResultCount = evmScanResp.result.length;
      // Ensure no duplicates are added to the nft array.
      const uniqueResults = evmScanResp.result.filter(
        (item: any) => !tokenActivities.some(activity => activity.hash === item.hash)
      );
      tokenActivities = tokenActivities.concat(uniqueResults as TEVMScanTokenActivity[]);

      if (currentResultCount === 0 || currentResultCount === previousResultCount) break;
      previousResultCount = currentResultCount;
      offset += limit;
    }

    return tokenActivities.map(t => {
      return {
        chainId: chain.id,
        symbol: t.tokenSymbol,
        from: t.from as TAddress,
        to: t.to as TAddress,
        value: t.value || 0,
        timestamp: t.timeStamp,
      };
    });
  }

  async getTokenActivities(
    action: string,
    address: string,
    queryOptions: Partial<GetTokenActivityQueryOptions> = {
      offset: 0,
      startblock: 0,
      endblock: 99999999,
    }
  ): Promise<TEVMScanResponse> {
    const params = objectToQueryString(queryOptions);
    const query = `module=account&action=${action}&address=${address}&${params}&&apikey=${this.apiKey}`;
    const res = await axios.get(`${this.apiUrl}?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
      },
    });
    const result = await res.data.json();
    return result.data;
  }
}
