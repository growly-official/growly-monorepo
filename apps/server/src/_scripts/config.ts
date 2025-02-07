import { alchemy } from 'chainsmith/src';
import * as Adapters from 'chainsmith/src/adapters';
import { ALCHEMY_API_KEY, CMC_API_BASE_URL, CMC_API_KEY } from '../constants';

export const AdapterRegistry = {
  CoinMarketcap: new Adapters.CoinMarketcapAdapter(CMC_API_BASE_URL, CMC_API_KEY),
  Uniswap: new Adapters.UniswapSdkAdapter(alchemy(ALCHEMY_API_KEY)),
  Evmscan: new Adapters.EvmscanAdapter(CMC_API_BASE_URL, CMC_API_KEY),
  DexScreener: new Adapters.DexScreenerAdapter(),
};
