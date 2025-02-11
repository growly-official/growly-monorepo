import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service.ts';
import type { TAddress, TChainName, TMultichain } from 'chainsmith/src/types/chains.d.ts';
import type { TTokenPortfolio } from 'chainsmith/src/types/stats.d.ts';
import { TTokenTransferActivity } from 'chainsmith/src/types/tokens';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/portfolio')
  async getWalletTokenPortfolio(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TTokenPortfolio> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.appService.getWalletTokenPortfolio(payload.walletAddress, payload.chainNames);
  }

  @Post('/activity')
  async listMultichainTokenTransferActivities(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.appService.listMultichainTokenTransferActivities(
      payload.walletAddress,
      payload.chainNames
    );
  }
}
