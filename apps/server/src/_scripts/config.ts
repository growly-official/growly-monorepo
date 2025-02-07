import { alchemy } from 'chainsmith/src';
import { CoinMarketcapAdapter, EvmscanAdapter, UniswapSdkAdapter } from 'chainsmith/src/adapters';
import { ALCHEMY_API_KEY, CMC_API_BASE_URL, CMC_API_KEY } from '../constants';

export const Adapters = {
  CoinMarketcap: new CoinMarketcapAdapter(CMC_API_BASE_URL, CMC_API_KEY),
  Uniswap: new UniswapSdkAdapter(alchemy(ALCHEMY_API_KEY)),
  Evmscan: new EvmscanAdapter(CMC_API_BASE_URL, CMC_API_KEY),
};
