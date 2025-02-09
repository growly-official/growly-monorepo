import 'reflect-metadata';
import { AdapterRegistry, buildDefaultChains } from '../config/index.ts';
import { Wallets } from 'chainsmith/src/data/index.ts';
import { ChainsmithSdk } from 'chainsmith/src/index.ts';
import { aggregateMultichainTokenBalance } from 'chainsmith/src/utils/portfolio.util.ts';

const chains = buildDefaultChains(['base', 'mainnet', 'zksync', 'optimism', 'baseSepolia']);
const sdk = ChainsmithSdk.init(chains);

function testExternalities(enabled: boolean, f: () => Promise<any>) {
  if (enabled) f().then(console.log);
}

async function fetchMultichainPortfolioWorks() {
  const wallets = {};
  for (const wallet of [Wallets.ETH_MAINNET_WALLET_PCMINH]) {
    const portfolio = await sdk.portfolio.getMultichainTokenPortfolio(
      AdapterRegistry.CoinMarketcap
    )(wallet);
    wallets[wallet] = portfolio;
  }
  return wallets;
}

async function fetchEvmscanTokenActivitiesWorks() {
  sdk.storage.writeToRam('walletAddress', Wallets.ETH_MAINNET_WALLET_PCMINH);
  const tokenTransferActivities = await sdk.token.listTokenTransferActivities(
    AdapterRegistry.Evmscan
  )();
  return tokenTransferActivities;
}

async function fetchDexScreenerParis() {
  return AdapterRegistry.DexScreener.fetchDexScreenerData(
    '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842'
  );
}

async function fetchAggregateMultichainTokenWorks() {
  const portfolio = await sdk.portfolio.getMultichainTokenPortfolio(AdapterRegistry.CoinMarketcap)(
    Wallets.ETH_MAINNET_WALLET_PCMINH
  );

  return aggregateMultichainTokenBalance(portfolio);
}

testExternalities(true, fetchAggregateMultichainTokenWorks);
testExternalities(false, fetchMultichainPortfolioWorks);
testExternalities(false, fetchEvmscanTokenActivitiesWorks);
testExternalities(false, fetchDexScreenerParis);
