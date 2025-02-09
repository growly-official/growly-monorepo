import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.ts';
import type { TAddress, TChainName, TMultichain } from 'chainsmith/src/types/chains.d.ts';
import type { TChainTokenData } from 'chainsmith/src/types/stats.d.ts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getWalletTokenPortfolio(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TMultichain<TChainTokenData>> {
    return this.appService.getWalletTokenPortfolio(payload.walletAddress, payload.chainNames);
  }
}
