import { autoInjectable } from 'tsyringe';
import { OnchainBusterPlugin } from './onchain-buster';
import { Logger } from 'tslog';

@autoInjectable()
export class ScoringEnginePlugin {
  logger = new Logger({ name: 'ScoringEnginePlugin' });

  constructor(private onchainBusterPlugin: OnchainBusterPlugin) {
    //TODO: Add onchain buster engine here
  }
}
