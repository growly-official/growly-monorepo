import { autoInjectable } from 'tsyringe';
import { SocialGithubPlugin } from './onchain-buster';
import { Logger } from 'tslog';

@autoInjectable()
export class MultiPlatformSocialPlugin {
  logger = new Logger({ name: 'MultiPlatformSocialPlugin' });

  constructor(private githubPlugin: SocialGithubPlugin) {}
}
