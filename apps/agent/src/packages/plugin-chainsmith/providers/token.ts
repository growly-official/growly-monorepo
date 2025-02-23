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

import type { TCMCUSDPrice } from 'chainsmith-sdk/src/adapters/coinmarketcap/types.d.ts';
import { ChainsmithSdk } from 'chainsmith-sdk/src/index.ts';
import { alchemy } from 'chainsmith-sdk/src/rpc/index.ts';
import {
  TAddress,
  TChain,
  TChainName,
  TContractToken,
  TMarketToken,
  TTokenPortfolio,
  TTokenSymbol,
} from 'chainsmith-sdk/src/types/index.ts';
import {
  aggregateMultichainTokenBalance,
  buildEvmChains,
  formatNumberSI,
  formatNumberUSD,
} from 'chainsmith-sdk/src/utils/index.ts';
import { AdapterRegistry } from '../config/chainsmith.ts';
import { WebSearchService } from '../services/tavily/index.ts';
import { SearchResponse } from '../services/tavily/types.ts';
import { PortfolioProvider } from './portfolio.ts';

export class TokenProvider {
  private sdk: ChainsmithSdk;
  private cache: NodeCache;
  private cacheKey = 'evm/token';
  private CACHE_EXPIRY_SEC = 10;

  constructor(
    private cacheManager: ICacheManager,
    private portfolioProvider: PortfolioProvider,
    private webSearchService: WebSearchService,
    chains: TChain[]
  ) {
    this.cache = new NodeCache({ stdTTL: this.CACHE_EXPIRY_SEC });
    this.sdk = ChainsmithSdk.init(chains);
  }

  async fetchMarketReport(symbol: string): Promise<TMarketToken<TCMCUSDPrice> | undefined> {
    const cacheKey = `tokenReport_${symbol}`;
    const cachedData = await this.getCachedData<TMarketToken<TCMCUSDPrice>>(cacheKey);

    if (cachedData) {
      elizaLogger.log(`Returning cached token report for symbol: ${symbol}`);
      return cachedData;
    }

    try {
      const tokenMetadata = await this.sdk.evmToken.getTokenMetadataBySymbol(symbol);
      if (!tokenMetadata) {
        console.error('Cannot find token in supported list!');
        return null;
      }

      const tokenInput: TContractToken = { ...tokenMetadata, balance: 0 }; // Convert for adapter input

      const coinmarketcapAdapter = AdapterRegistry.CoinMarketcap;

      const marketToken = await coinmarketcapAdapter.fetchTokenWithPrice('mainnet', tokenInput);

      this.setCachedData<TMarketToken<TCMCUSDPrice>>(cacheKey, marketToken);
      elizaLogger.log('Market token cached for symbol: ', symbol);
      return marketToken;
    } catch (error: any) {
      console.error('Error getting address portfolio:', error);
      return null;
    }
  }

  async fetchTokenNews(symbol: string): Promise<SearchResponse> {
    const cacheKey = `tokenNews_${symbol}`;
    const cachedData = await this.getCachedData<SearchResponse>(cacheKey);

    if (cachedData) {
      elizaLogger.log(`Returning cached token news for symbol: ${symbol}`);
      return cachedData;
    }

    try {
      const webSearchPrompt = `What are the latest news and market sentiment of cryptocurrency token ${symbol}?`;
      const searchResponse = await this.webSearchService.search(webSearchPrompt);

      this.setCachedData<SearchResponse>(cacheKey, searchResponse);
      elizaLogger.log('News cached for symbol: ', symbol);
      return searchResponse;
    } catch (error: any) {
      console.error('Error getting address portfolio:', error);
      return null;
    }
  }

  formatTokenReport(
    symbol: string,
    // marketToken: TMarketToken<TCMCUSDPrice>,
    // tokenNews: SearchResponse,
    tokenPortfolio: TTokenPortfolio
  ): string {
    // Output builder
    let output = `Token Report for symbol: ${symbol}\n`;

    // output += '\n**Market sentiment and news:**\n';
    // output += `${tokenNews.answer}`;

    const portfolioValue = tokenPortfolio.totalUsdValue;
    // Token distribution
    const balanceBySymbol = tokenPortfolio.aggregatedBalanceByToken;

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

  async getFormattedTokenReport(symbol: string): Promise<string> {
    try {
      // const marketToken = await this.fetchMarketReport(symbol);
      // const tokenNews = await this.fetchTokenNews(symbol);
      const portfolio = await this.portfolioProvider.fetchMultichainPortfolio();
      const multichainPortfolio = aggregateMultichainTokenBalance(portfolio);

      return this.formatTokenReport(symbol, multichainPortfolio);
    } catch (error) {
      elizaLogger.error('Error generating portfolio report:', error);
      return 'Unable to fetch portfolio information. Please try again later.';
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

export const evmTokenProvider: Provider = {
  async get(runtime: IAgentRuntime, _message: Memory, state?: State): Promise<string | null> {
    try {
      const chainNames = (runtime.character.settings.chains?.evm as TChainName[]) || ['mainnet'];
      const ALCHEMY_API_KEY = runtime.getSetting('ALCHEMY_API_KEY');

      // Get from state
      const address = state?.walletAddress as TAddress;
      const symbol = state?.symbol as TTokenSymbol;

      const chains = buildEvmChains(chainNames, alchemy(ALCHEMY_API_KEY));
      const portfolioProvider = new PortfolioProvider(runtime.cacheManager, address, chains);

      const webSearchService = new WebSearchService();
      webSearchService.initialize(runtime);

      const tokenProvider = new TokenProvider(
        runtime.cacheManager,
        portfolioProvider,
        webSearchService,
        chains
      );

      return tokenProvider.getFormattedTokenReport(symbol);
    } catch (error) {
      console.error('Error in EVM token provider:', error);
      return null;
    }
  },
};
