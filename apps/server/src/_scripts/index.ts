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
  for (const wallet of [Wallets.ETH_MAINNET_WALLET_PCMINH]) {
    wallets[wallet] = await sdk.portfolio.getMultichainTokenPortfolio(
      AdapterRegistry.CoinMarketcap
    )(wallet);
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

testExternalities(false, fetchMultichainPortfolioWorks);
testExternalities(true, fetchEvmscanTokenActivitiesWorks);
testExternalities(false, fetchDexScreenerParis);
