import 'reflect-metadata';
import { Wallets } from '@chainsmith-data';
import { alchemy, buildEvmChains, ChainsmithSdk } from '@chainsmith-sdk';
import * as Constants from '../constants';
import { Adapters } from './config';

const chains = buildEvmChains(['base', 'mainnet'], alchemy(Constants.ALCHEMY_API_KEY));
const sdk = ChainsmithSdk.init(chains);

function testExternalities(enabled: boolean, f: () => Promise<any>) {
  if (enabled) f().then(console.log);
}

async function fetchMultichainPortfolioWorks() {
  const wallets = {};
  for (const wallet of [Wallets.ETH_MAINNET_WALLET_PCMINH, Wallets.ETH_MAINNET_WALLET_JESSE]) {
    wallets[wallet] = await sdk.portfolio.getMultichainTokenPortfolio(Adapters.CoinMarketcap)(
      wallet
    );
  }
  return wallets;
}

async function fetchEvmscanTokenActivitiesWorks() {
  sdk.storage.writeToRam('walletAddress', Wallets.ETH_MAINNET_WALLET_PCMINH);
  return sdk.token.listTokenTransferActivities(Adapters.Evmscan)();
}

testExternalities(true, fetchMultichainPortfolioWorks);
testExternalities(false, fetchEvmscanTokenActivitiesWorks);
