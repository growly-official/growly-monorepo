import { TAddress } from './chains';

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

export type TToken = TNativeToken | TContractToken;

export type TMarketToken = TToken & {
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
