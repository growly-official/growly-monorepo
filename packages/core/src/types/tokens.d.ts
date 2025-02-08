import type { TAddress } from './chains.d.ts';

export type TTokenSymbol = string;
export type TTokenId = number;
export type TTokenAddress = TAddress;

export type TTokenMetadata = {
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
};

export type TExtraField<T> = { extra?: T };

export type TTokenTransferActivity = {
  chainId: number;
  symbol: TTokenSymbol;
  from: TAddress;
  to: TAddress;
  value: string | number;
  timestamp: string;
};

export type TContractTokenMetadata = TTokenMetadata & {
  address: TTokenAddress;
  type: 'contract';
};

export type TNativeTokenMetadata = TTokenMetadata & {
  type: 'native';
};
export type TTokenListResponse = {
  name: string;
  timestamp: string;
  tokens: TokenMetadata[];
};

export type TNativeToken = TNativeTokenMetadata & {
  balance: number;
};

export type TContractToken = TContractTokenMetadata & {
  balance: number;
};

export type TToken<T = any> = (TNativeToken | TContractToken) & TExtraField<T>;

export type TMarketToken<T = any> = TToken<T> & {
  usdValue: number;
  marketPrice: number;
};

export type TValueByChain = {
  chainName: string;
  value: number;
};

export type TPriceData = {
  price: number;
  totalUSDValue: number;
};

export type TMultichainToken = Omit<TToken, 'chainId'> &
  Partial<TPriceData> & {
    chains: TValueByChain[];
    tags: string[];
  };
