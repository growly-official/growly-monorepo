import { adapters } from 'chainsmith-sdk/src/index.ts';
import { EvmTokenPlugin } from 'chainsmith-sdk/src/plugins/evm/index.ts';

export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';

export const COINMARKETCAP_API_BASE_URL = 'https://pro-api.coinmarketcap.com';
export const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';

export const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api';
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export const AdapterRegistry = {
  Alchemy: new adapters.AlchemyAdapter(ALCHEMY_API_KEY, new EvmTokenPlugin()),
  CoinMarketcap: new adapters.CoinMarketcapAdapter(
    COINMARKETCAP_API_BASE_URL,
    COINMARKETCAP_API_KEY
  ),
  Evmscan: new adapters.EvmscanAdapter(ETHERSCAN_BASE_URL, ETHERSCAN_API_KEY),
  DexScreener: new adapters.DexScreenerAdapter(),
};
