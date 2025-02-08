import * as EvmChainList from 'viem/chains';
import { Address as EvmAddress, BlockNumber as EvmBlockNumber } from 'viem';

export type TBlockNumber = EvmBlockNumber | bigint;

export type THexString = `0x${string}`;

export type TAddress = EvmAddress | THexString;

export type TChainEcosystem = 'evm' | 'svm' | 'other';

export type TPortfolio = {
  address: TAddress;
  chainList: TChain[];
};

export type TChainName = keyof typeof EvmChainList;

export type TBaseChainType = EvmChainList.Chain;

export type TChainId = string;

export type TChainMetadata = {
  chainName: TChainName;
  ecosystem: TChainEcosystem;
};

export type IMultichain<T> = Partial<Record<TChainName, T>>;
export type IMultiEcosystem<T> = Partial<Record<TChainEcosystem, T>>;

export type TBaseChain = TBaseChainType & Partial<TChainMetadata>;

export type TChain = TBaseChainType & TChainMetadata;

export type IEcosystemRegistry = IMultiEcosystem<{
  name: string;
  chains: TChainName[];
}>;

export type IEcosystemChainRegistry = IMultiEcosystem<{ chains: TChainName[] }>;
