import { Logger } from 'tslog';
import { TAddress, TChainName, TTokenAddress } from '../types';

export type WithAdapter<A, R> = (adapter: A) => R;
export type WithManyAdapters<A extends IAdapter[], R> = (adapters: A) => R;
export interface IAdapter {
  name: string;
  logger?: Logger;
}

export interface IMarketDataAdapter extends IAdapter {
  fetchTokenWithPrice(chain: TChainName, token: TToken): Promise<TMarketToken | undefined>;

  fetchTokensWithPrice(
    chain: TChainName,
    tokens: TToken[]
  ): Promise<{ tokens: TMarketToken[]; totalUsdValue: number }>;
}

export interface IOnchainActivityAdapter extends IAdapter {
  listAllTokenActivities(chain: TChainName, address: TAddress, limit: number);
}
