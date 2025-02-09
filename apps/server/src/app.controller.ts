import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.ts';
import type { TAddress, TChainName } from 'chainsmith/src/types/chains.d.ts';
import type { TTokenPortfolio } from 'chainsmith/src/types/stats.d.ts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/portfolio')
  async getWalletTokenPortfolio(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TTokenPortfolio> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.appService.getWalletTokenPortfolio(payload.walletAddress, payload.chainNames);
  }
}
