import { rpc, adapters } from 'chainsmith/src/index.ts';

export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';

export const SIMPLE_HASH_API_BASE_URL = process.env.SIMPLE_HASH_API_BASE_URL;
export const SIMPLE_HASH_API_KEY = process.env.SIMPLE_HASH_API_KEY;

export const CMC_API_BASE_URL = 'https://pro-api.coinmarketcap.com';
export const CMC_API_KEY = process.env.CMC_API_KEY || '';

export const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api';
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export const AdapterRegistry = {
  CoinMarketcap: new adapters.CoinMarketcapAdapter(CMC_API_BASE_URL, CMC_API_KEY),
  Uniswap: new adapters.UniswapSdkAdapter(rpc.alchemy(ALCHEMY_API_KEY)),
  Evmscan: new adapters.EvmscanAdapter(ETHERSCAN_BASE_URL, ETHERSCAN_API_KEY),
  DexScreener: new adapters.DexScreenerAdapter(),
};
