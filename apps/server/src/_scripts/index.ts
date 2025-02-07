import 'reflect-metadata';
import { Wallets } from 'chainsmith/src/data';
import { alchemy, buildEvmChains, ChainsmithSdk } from 'chainsmith/src';
import * as Constants from '../constants';
import { AdapterRegistry } from './config';

const chains = buildEvmChains(['base', 'mainnet'], alchemy(Constants.ALCHEMY_API_KEY));
const sdk = ChainsmithSdk.init(chains);

function testExternalities(enabled: boolean, f: () => Promise<any>) {
  if (enabled) f().then(console.log);
}

async function fetchMultichainPortfolioWorks() {
  const wallets = {};
  for (const wallet of [Wallets.ETH_MAINNET_WALLET_PCMINH, Wallets.ETH_MAINNET_WALLET_JESSE]) {
    wallets[wallet] = await sdk.portfolio.getMultichainTokenPortfolio(
      AdapterRegistry.CoinMarketcap
    )(wallet);
  }
  return wallets;
}

async function fetchEvmscanTokenActivitiesWorks() {
  sdk.storage.writeToRam('walletAddress', Wallets.ETH_MAINNET_WALLET_PCMINH);
  return sdk.token.listTokenTransferActivities(AdapterRegistry.Evmscan)();
}

async function fetchDexScreenerParis() {
  return AdapterRegistry.DexScreener.fetchDexScreenerData(
    'A55XjvzRU4KtR3Lrys8PpLZQvPojPqvnv5bJVHMYy3Jv'
  );
}

testExternalities(false, fetchMultichainPortfolioWorks);
testExternalities(false, fetchEvmscanTokenActivitiesWorks);
testExternalities(true, fetchDexScreenerParis);
