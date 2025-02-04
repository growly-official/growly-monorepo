import { TChainName, TTokenAddress } from '../types';

export type IAdapter = any;
export type WithAdapter<A, R> = (adapter: A) => R;
export type WithManyAdapters<A extends IAdapter[], R> = (...adapters: A) => R;

export interface IMarketDataAdapter extends IAdapter {
  fetchTokenWithPrice(chain: TChainName, token: TToken): Promise<TMarketToken | undefined>;

  fetchTokensWithPrice(
    chain: TChainName,
    tokens: TToken[]
  ): Promise<{ tokens: TMarketToken[]; totalUsdValue: number }>;
}
