import { Logger } from 'tslog';
import {
  IUniswapChainTokenMap,
  IUniswapTokenAddressMap,
  TUniswapGetConstantParameters,
  TUniswapQuoteConfig,
  TUniswapTokenDetail,
} from './types';
import { TContractToken, TMarketToken, TChainId, TChainName, TChain } from '../../types';
import { Files } from '../../data';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { fromReadableAmount } from './utils';
import { IMarketDataAdapter } from '../adapter';
import { CHAIN_TO_ADDRESSES_MAP, Token, WETH9 } from '@uniswap/sdk-core';
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk';
import { GetChainRpcEndpoint } from '../../rpc';
import { getChainByName, getChainIdByName } from '../../utils/chain.util';
import { createClient, formatUnits, getContract, http } from 'viem';
import { UniswapV3PoolAbi } from '../../data/abis';

const wrapUniswapTokenType = (token: TContractToken | TUniswapTokenDetail) => {
  if (token.symbol === 'ETH') return WETH9[token.chainId];
  return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name);
};

export class UniswapSdkAdapter implements IMarketDataAdapter {
  name = 'UniswapSdkAdapater';
  logger = new Logger({ name: this.name });

  getRpcUrl: GetChainRpcEndpoint;
  chainTokenMap: IUniswapChainTokenMap;

  constructor(getRpcUrl: GetChainRpcEndpoint) {
    this.chainTokenMap = this.intoChainTokenAddressMap(Files.TokenList.UniswapTokenList);
    this.getRpcUrl = getRpcUrl;
  }

  async fetchTokenWithPrice(
    chainName: TChainName,
    token: TContractToken
  ): Promise<TMarketToken | undefined> {
    const chain = getChainByName(chainName);
    if (!chain) throw new Error('No chain found');
    const rpc = this.getRpcUrl(chain);

    const USDC = this.chainTokenMap[chain.id]['USDC'];
    const price = await this.quote(chain, rpc, {
      amountIn: 1,
      in: wrapUniswapTokenType(USDC),
      out: wrapUniswapTokenType(token),
      poolFee: FeeAmount.MEDIUM,
    });
    return {
      ...token,
      usdValue: token.balance * price,
      marketPrice: price,
    };
  }

  async fetchTokensWithPrice(
    chainName: TChainName,
    tokens: TContractToken[]
  ): Promise<{ tokens: TMarketToken[]; totalUsdValue: number }> {
    const chain = getChainByName(chainName);
    if (!chain) throw new Error('No chain found');
    const rpc = this.getRpcUrl(chain);

    let totalUsdValue = 0;
    const USDC = this.chainTokenMap[chain.id]['USDC'];
    const marketTokens: TMarketToken[] = [];
    for (const token of tokens) {
      this.quote(chain, rpc, {
        amountIn: 1,
        in: wrapUniswapTokenType(USDC),
        out: wrapUniswapTokenType(token),
        poolFee: FeeAmount.MEDIUM,
      }).then(p => {
        const usdValue = p * token.balance;
        totalUsdValue += usdValue;
        marketTokens.push({
          ...token,
          usdValue,
          marketPrice: p,
        });
      });
    }
    return {
      tokens: marketTokens,
      totalUsdValue,
    };
  }

  // Map token address to Uniswap token details.
  intoChainTokenAddressMap = (m: { tokens: TUniswapTokenDetail[] }) => {
    const tokenList = m.tokens;
    const chainMap: Record<TChainId, IUniswapTokenAddressMap> = {};
    for (const token of tokenList) {
      chainMap[token.chainId] = {
        ...chainMap[token.chainId],
        [token.symbol]: token,
      };
    }
    return chainMap;
  };

  getTokenAddressMap = (
    chainName: TChainName,
    tokens: TContractToken[]
  ): IUniswapTokenAddressMap => {
    try {
      const tokenAddresses = tokens.map(token => token.address);
      const chainId = getChainIdByName(chainName);

      const result: IUniswapTokenAddressMap = {};
      for (const tokenAddress of tokenAddresses) {
        const tokenDetail = this.chainTokenMap[chainId][tokenAddress];
        if (!tokenDetail) continue;
        result[tokenAddress] = tokenDetail;
      }
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to get token address map: ${error.message}`);
      throw new Error(error);
    }
  };

  async getPoolConstants(
    chain: TChain,
    rpcUrl: string,
    params: TUniswapGetConstantParameters
  ): Promise<{
    token0: string;
    token1: string;
    fee: number;
  }> {
    try {
      const client = createClient({
        chain,
        transport: http(rpcUrl),
        batch: {
          multicall: true,
        },
      });
      const currentPoolAddress = computePoolAddress({
        factoryAddress: (CHAIN_TO_ADDRESSES_MAP as any)[chain.id]?.v3CoreFactoryAddress,
        tokenA: params.in,
        tokenB: params.out,
        fee: params.poolFee,
      });

      const poolContract = getContract({
        client,
        address: currentPoolAddress as any,
        abi: UniswapV3PoolAbi,
      });

      const [token0, token1, fee]: any[] = await Promise.all([
        poolContract.read.token0(),
        poolContract.read.token1(),
        poolContract.read.fee(),
      ]);

      return {
        token0,
        token1,
        fee,
      };
    } catch (error: any) {
      throw new Error(`Failed to get pool constants: ${error.message}`);
    }
  }

  async quote(chain: TChain, rpcUrl: string, config: TUniswapQuoteConfig): Promise<number> {
    try {
      if (config.out.symbol === 'USDC') return 1;
      const client = createClient({
        chain,
        transport: http(rpcUrl),
        batch: {
          multicall: true,
        },
      });
      const quoterContract = getContract({
        client,
        address: (CHAIN_TO_ADDRESSES_MAP as any)[chain.id]?.quoterAddress as any,
        abi: Quoter.abi,
      });
      const poolConstants = await this.getPoolConstants(chain, rpcUrl, config);
      const quotedAmountOut: any = await quoterContract.read.quoteExactInputSingle([
        poolConstants.token0,
        poolConstants.token1,
        poolConstants.fee,
        fromReadableAmount(config.amountIn, config.in.decimals).toString(),
        0,
      ]);
      const result = formatUnits(quotedAmountOut, config.out.decimals);
      const parsedResult = parseFloat(result as any);
      return parsedResult > 0 ? 1 / parsedResult : parsedResult;
    } catch (error: any) {
      this.logger.error(`Failed to quote token price: ${error.message}`);
      throw new Error(error);
    }
  }
}
