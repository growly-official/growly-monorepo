import { Injectable } from '@nestjs/common';
import {
  TAddress,
  TChainName,
  TMultichain,
  TChainId,
  TTokenPortfolio,
  TTokenTransferActivity,
} from 'chainsmith-sdk/src/types/index.ts';
import { AdapterRegistry, initChainsmithSdk } from './config/index.ts';

@Injectable()
export class AppService {
  async getWalletTokenPortfolio(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TTokenPortfolio> {
    const sdk = initChainsmithSdk(chainNames);
    return sdk.portfolio.getMultichainTokenPortfolio([
      AdapterRegistry.CoinMarketcap,
      AdapterRegistry.Alchemy,
    ])(walletAddress, sdk.storage.readDisk('chains'));
  }

  async listMultichainTokenTransferActivities(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    const sdk = initChainsmithSdk(chainNames);
    return sdk.token.listMultichainTokenTransferActivities(AdapterRegistry.Evmscan)(
      walletAddress,
      sdk.storage.readDisk('chains')
    );
  }

  getChainMetadata(chainId: TChainId) {
    const sdk = initChainsmithSdk();
    return sdk.evmChain.getChainMetadata(chainId);
  }

  getAllChainMetadata() {
    const sdk = initChainsmithSdk();
    return sdk.evmChain.getAllChainMetadata();
  }
}
