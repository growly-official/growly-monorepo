import { alchemy } from '../../../packages/core/src';
import { CoinMarketcapAdapter, UniswapSdkAdapter } from '../../../packages/core/src/adapters';
import { ALCHEMY_API_KEY, CMC_API_BASE_URL, CMC_API_KEY } from './constants';

export const Adapters = {
  CoinMarketcap: new CoinMarketcapAdapter(CMC_API_BASE_URL, CMC_API_KEY),
  Uniswap: new UniswapSdkAdapter(alchemy(ALCHEMY_API_KEY)),
};
