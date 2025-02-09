import { Injectable } from '@nestjs/common';
import { TAddress, TChainName, TChainTokenData, TMultichain } from 'chainsmith/src/types/index.ts';
import { AdapterRegistry, initChainsmithSdk } from './config/index.ts';

@Injectable()
export class AppService {
  getWalletTokenPortfolio(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TChainTokenData>> {
    const sdk = initChainsmithSdk(chainNames);
    return sdk.portfolio.getMultichainTokenPortfolio(AdapterRegistry.CoinMarketcap)(
      walletAddress,
      sdk.storage.readDisk('chains')
    );
  }
}
