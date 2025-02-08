import 'reflect-metadata';
import { AdapterRegistry, ALCHEMY_API_KEY } from './config.ts';
import { Wallets } from 'chainsmith/src/data/index.ts';
import { ChainsmithSdk } from 'chainsmith/src/index.ts';
import { buildEvmChains } from 'chainsmith/src/utils/index.ts';
import { alchemy } from 'chainsmith/src/rpc/index.ts';

const chains = buildEvmChains(['base', 'mainnet'], alchemy(ALCHEMY_API_KEY));
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
    console.log(portfolio.base.tokens[0]);
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

testExternalities(true, fetchMultichainPortfolioWorks);
testExternalities(false, fetchEvmscanTokenActivitiesWorks);
testExternalities(false, fetchDexScreenerParis);
