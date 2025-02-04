import { FeeAmount } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';

export type TUniswapTokenDetail = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export type TUniswapQuoteConfig = {
  in: Token;
  amountIn: number;
  out: Token;
  poolFee: FeeAmount;
};

export type TUniswapGetConstantParameters = {
  in: Token;
  out: Token;
  poolFee: FeeAmount;
};

export type IUniswapTokenAddressMap = Record<TTokenAddress, TUniswapTokenDetail>;

export type IUniswapChainTokenMap = Record<TChainId, IUniswapTokenAddressMap>;
