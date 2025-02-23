import {
  type IAgentRuntime,
  type ICacheManager,
  type Memory,
  type Provider,
  type State,
  elizaLogger,
} from '@elizaos/core';
import NodeCache from 'node-cache';
import * as path from 'node:path';

import { ChainsmithSdk } from 'chainsmith-sdk/src/index.ts';
import { alchemy } from 'chainsmith-sdk/src/rpc/index.ts';
import {
  TAddress,
  TChain,
  TChainName,
  TClient,
  TMarketTokenList,
  TMultichain,
  TTokenChainData,
} from 'chainsmith-sdk/src/types/index.ts';
import {
  aggregateMultichainTokenBalance,
  buildEvmChains,
  formatNumberSI,
  formatNumberUSD,
  getChainByName,
} from 'chainsmith-sdk/src/utils/index.ts';
import { createClient } from 'chainsmith-sdk/src/wrapper.ts';
import { AdapterRegistry } from '../config/chainsmith.ts';

export class PortfolioProvider {
  private sdk: ChainsmithSdk;
  private cache: NodeCache;
  private cacheKey = 'evm/portfolio';
  private CACHE_EXPIRY_SEC = 5;
  chains: TChain[];
  address: TAddress;

  constructor(
    private cacheManager: ICacheManager,
    address: TAddress,
    chains: TChain[]
  ) {
    this.address = address;
    this.chains = chains;
    this.sdk = ChainsmithSdk.init(chains);
    this.cache = new NodeCache({ stdTTL: this.CACHE_EXPIRY_SEC });
  }

  getPublicClient(chainName: TChainName): TClient {
    const chain = getChainByName(chainName);
    return createClient({ chain });
  }

  async getENSName(): Promise<string> {
    const publicClient = this.getPublicClient('mainnet');
    const ensName = await publicClient.getEnsName({
      address: this.address,
    });

    return ensName;
  }

  async fetchMultichainPortfolio(): Promise<TMultichain<TMarketTokenList>> {
    const cacheKey = `walletPortfolio_${this.address}`;
    const cachedData = await this.getCachedData<TMultichain<TMarketTokenList>>(cacheKey);

    if (cachedData) {
      elizaLogger.log(`Returning cached portfolio for wallet: ${this.address}`);
      return cachedData;
    }

    try {
      const tokenList = await this.sdk.portfolio.getMultichainTokenList([
        AdapterRegistry.CoinMarketcap,
        AdapterRegistry.Alchemy,
      ])(this.address);

      this.setCachedData<TMultichain<TMarketTokenList>>(cacheKey, tokenList);
      elizaLogger.log('Multichain token list cached for address: ', this.address);
      return tokenList;
    } catch (error: any) {
      console.error('Error getting address portfolio:', error);
      return null;
    }
  }

  formatPortfolio(portfolio: TMultichain<TMarketTokenList>): string {
    const multichainPortfolio = aggregateMultichainTokenBalance(portfolio);
    const portfolioValue = multichainPortfolio.totalUsdValue;
    const balanceBySymbol = multichainPortfolio.aggregatedBalanceByToken;

    // Output builder
    let output = `Wallet Address: ${this.address}\n`;

    output += `\nTotal Value: ${formatNumberUSD(portfolioValue)}\n`;

    // Token distribution
    const highValueTokens = Object.values(balanceBySymbol).filter(
      token => token.totalUsdValue > 1 // exclude < 1$ assets
    );

    if (highValueTokens.length === 0) {
      output += 'No tokens found with value >1$\n';
    } else {
      output += `\nToken value distribution:\n`;
      highValueTokens.forEach(token => {
        output += `${token.marketData.symbol}\n`;
        output += `  - Holding balance:       ${formatNumberUSD(token.totalUsdValue)}\n`;
        output += `  - Portfolio allocation:  ${((100 * token.totalUsdValue) / portfolioValue).toFixed(2)}%\n`;
        output += `  - Market rank:           ${token.marketData.marketRank}\n`;
        output += `  - Market cap:            ${formatNumberSI(token.marketData.extra.market_cap)}\n`;
        output += `  - Volume 24h:            ${formatNumberSI(token.marketData.extra.volume_24h)}\n`;
        output += `  - Percent change 24h:    ${token.marketData.extra.percent_change_24h.toFixed(2)}%\n`;
        output += `  - Percent change 7d:     ${token.marketData.extra.percent_change_7d.toFixed(2)}%\n`;
        output += `  - Percent change 30d:    ${token.marketData.extra.percent_change_30d.toFixed(2)}%\n`;
        output += `  - Percent change 60d:    ${token.marketData.extra.percent_change_60d.toFixed(2)}%\n`;
        output += `  - Percent change 90d:    ${token.marketData.extra.percent_change_90d.toFixed(2)}%\n`;
      });
    }

    return output;
  }

  async getFormattedPortfolio(): Promise<string> {
    try {
      const portfolio = await this.fetchMultichainPortfolio();

      return this.formatPortfolio(portfolio);
    } catch (error) {
      elizaLogger.error('Error generating portfolio report:', error);
      return 'Unable to fetch portfolio information. Please try again later.';
    }
  }

  async fetchTokenInPortfolio(symbol: string): Promise<TTokenChainData | null> {
    try {
      const portfolio = await this.fetchMultichainPortfolio();
      const multichainPortfolio = aggregateMultichainTokenBalance(portfolio);

      const balanceBySymbol = multichainPortfolio.aggregatedBalanceByToken;

      if (symbol in balanceBySymbol) {
        return balanceBySymbol[symbol];
      }

      return null;
    } catch (error) {
      elizaLogger.error('Error generating portfolio report:', error);
      return null;
    }
  }

  // Cache related functions
  private async readFromCache<T>(key: string): Promise<T | null> {
    const cached = await this.cacheManager.get<T>(path.join(this.cacheKey, key));
    return cached;
  }

  private async writeToCache<T>(key: string, data: T): Promise<void> {
    await this.cacheManager.set(path.join(this.cacheKey, key), data, {
      expires: Date.now() + this.CACHE_EXPIRY_SEC * 1000,
    });
  }

  private async getCachedData<T>(key: string): Promise<T | null> {
    // Check in-memory cache first
    const cachedData = this.cache.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    // Check file-based cache
    const fileCachedData = await this.readFromCache<T>(key);
    if (fileCachedData) {
      // Populate in-memory cache
      this.cache.set(key, fileCachedData);
      return fileCachedData;
    }

    return null;
  }

  private async setCachedData<T>(cacheKey: string, data: T): Promise<void> {
    // Set in-memory cache
    this.cache.set(cacheKey, data);

    // Write to file-based cache
    await this.writeToCache(cacheKey, data);
  }
}

export const evmPortfolioProvider: Provider = {
  async get(runtime: IAgentRuntime, _message: Memory, state?: State): Promise<string | null> {
    try {
      const chainNames = (runtime.character.settings.chains?.evm as TChainName[]) || [
        'mainnet',
        'base',
      ];
      const ALCHEMY_API_KEY = runtime.getSetting('ALCHEMY_API_KEY');
      const address = state?.walletAddress as TAddress;

      const chains = buildEvmChains(chainNames, alchemy(ALCHEMY_API_KEY));

      const portfolioProvider = new PortfolioProvider(runtime.cacheManager, address, chains);
      return portfolioProvider.getFormattedPortfolio();
    } catch (error) {
      console.error('Error in EVM portfolio provider:', error);
      return null;
    }
  },
};
