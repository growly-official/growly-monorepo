import 'reflect-metadata';
import { AdapterRegistry, buildDefaultChains } from '../config/index.ts';
import { Wallets } from 'chainsmith-sdk/src/data/index.ts';
import { ChainsmithSdk } from 'chainsmith-sdk/src/index.ts';

const chains = buildDefaultChains(['sonic']);
const sdk = ChainsmithSdk.init(chains);

async function main() {
  const portfolio = await sdk.portfolio.getMultichainTokenPortfolio([
    AdapterRegistry.CoinMarketcap,
    AdapterRegistry.Alchemy,
  ])(Wallets.ETH_MAINNET_WALLET_JESSE);
}

main();
