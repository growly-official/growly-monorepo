import { MultichainTokenPlugin } from '../token';
import { IMultichainTokenData, TAddress, TChain, TChainTokenData } from '../../types';
import { createClient } from '../../wrapper';
import { Logger } from 'tslog';
import { autoInjectable } from 'tsyringe';
import { IMarketDataAdapter, WithManyAdapters } from '../../adapters/adapter';

type IGetMultichainPortfolio = (
  chains: TChain[],
  address: TAddress
) => Promise<IMultichainTokenData>;
type IGetChainPortfolio = (chain: TChain, address: TAddress) => Promise<TChainTokenData>;

@autoInjectable()
export class MultichainPortfolioPlugin {
  logger = new Logger({ name: 'MultichainPortfolioPlugin' });

  constructor(private tokenPlugin: MultichainTokenPlugin) {}

  getMultichainTokenPortfolio: WithManyAdapters<[IMarketDataAdapter], IGetMultichainPortfolio> =
    adapter => async (chains: TChain[], address: TAddress) => {
      try {
        const portfolio: IMultichainTokenData = {};
        for (const chain of chains) {
          portfolio[chain.chainName] = await this.getChainTokenPortfolio(adapter)(chain, address);
        }
        return portfolio;
      } catch (error: any) {
        this.logger.error(`Failed to get multichain token portfolio: ${error}`);
        throw new Error(error);
      }
    };

  getChainTokenPortfolio: WithManyAdapters<[IMarketDataAdapter], IGetChainPortfolio> =
    adapter =>
    async (chain: TChain, address: TAddress): Promise<TChainTokenData> => {
      try {
        const client = createClient({
          chain,
        });
        if (!adapter) throw new Error('No adapter found');
        const nativeToken = await this.tokenPlugin.getNativeToken(client, address);
        const contractTokens = await this.tokenPlugin.getContractTokens(client, address);
        const tokens = [nativeToken, ...contractTokens];
        const marketData = await adapter.fetchTokensWithPrice(chain.chainName, tokens);
        return {
          tokens: marketData.tokens,
          totalUsdValue: marketData.totalUsdValue,
        };
      } catch (error: any) {
        this.logger.error(`Failed to get chain token portfolio: ${error}`);
        throw new Error(error);
      }
    };
}
