import { TTokenPortfolio } from '../../types/index.d.ts';

export type TGetMultichainTokenList = (
  walletAddress?: TAddress,
  chains?: TChain[]
) => Promise<TMultichain<TChainTokenList>>;

export type TGetChainTokenList = (chain: TChain, address: TAddress) => Promise<TChainTokenList>;

export type IGetMultichainTokenPortfolio = (
  walletAddress?: TAddress,
  chains?: TChain[]
) => Promise<TTokenPortfolio>;
