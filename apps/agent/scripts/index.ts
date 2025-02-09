import { TChainName, TChainTokenList, TMultichain } from 'chainsmith/src/types';
import {
  aggregateMultichainTokenBalance,
  formatNumberUSD,
  getChainByName,
} from 'chainsmith/src/utils';
const mockResponse: TMultichain<TChainTokenList> = {
  base: {
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        chainId: 8453,
        type: 'native',
        balance: 0.20294706312983624,
        usdValue: 540.2323368374447,
        marketPrice: 2661.9371993169902,
        extra: {
          price: 2661.9371993169902,
          volume_24h: 15870901712.660969,
          volume_change_24h: -45.1796,
          percent_change_1h: 0.09795127,
          percent_change_24h: 1.69459509,
          percent_change_7d: -14.44117358,
          percent_change_30d: -18.73138646,
          percent_change_60d: -27.67891489,
          percent_change_90d: -15.19197705,
          market_cap: 320858734290.5502,
          market_cap_dominance: 10.0851,
          fully_diluted_market_cap: 320858734290.55,
          tvl: null,
          last_updated: '2025-02-09T07:03:00.000Z',
        },
      },
      {
        chainId: 8453,
        address: '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842',
        name: 'Morpho Token',
        symbol: 'MORPHO',
        decimals: 18,
        logoURI: 'https://ethereum-optimism.github.io/data/MORPHO/logo.svg',
        extensions: {
          baseBridgeAddress: '0x4200000000000000000000000000000000000010',
          opListId: 'extended',
          opTokenId: 'MORPHO',
        },
        balance: 141.69255361445119,
        usdValue: 284.52009304540735,
        marketPrice: 2.0080102008719054,
        extra: {
          price: 2.0080102008719054,
          volume_24h: 37249868.12534056,
          volume_change_24h: -42.6046,
          percent_change_1h: -0.15032281,
          percent_change_24h: 13.26290846,
          percent_change_7d: -27.53641856,
          percent_change_30d: -32.58551273,
          percent_change_60d: -1.8416685,
          percent_change_90d: 61.82174367,
          market_cap: 437396828.92480135,
          market_cap_dominance: 0.0137,
          fully_diluted_market_cap: 2008010200.87,
          tvl: null,
          last_updated: '2025-02-09T07:03:00.000Z',
        },
      },
      {
        chainId: 8453,
        address: '0xA88594D404727625A9437C3f886C7643872296AE',
        name: 'Moonwell',
        symbol: 'WELL',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/26133/large/WELL.png?1696525221',
        balance: 11007.251665583295,
        usdValue: 342.56733751471944,
        marketPrice: 0.031121968309840233,
        extra: {
          price: 0.031121968309840233,
          volume_24h: 2547611.33673035,
          volume_change_24h: -37.4736,
          percent_change_1h: 0.16999162,
          percent_change_24h: 2.86157804,
          percent_change_7d: -13.41457821,
          percent_change_30d: -38.71759811,
          percent_change_60d: -60.64121168,
          percent_change_90d: -59.72452404,
          market_cap: 0,
          market_cap_dominance: 0,
          fully_diluted_market_cap: 155609841.55,
          tvl: null,
          last_updated: '2025-02-09T07:04:00.000Z',
        },
      },
    ],
    totalUsdValue: 1167.3197673975715,
  },
  mainnet: {
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        chainId: 1,
        type: 'native',
        balance: 0.01949419004302655,
        usdValue: 51.89230964608725,
        marketPrice: 2661.9371993169902,
        extra: {
          price: 2661.9371993169902,
          volume_24h: 15870901712.660969,
          volume_change_24h: -45.1796,
          percent_change_1h: 0.09795127,
          percent_change_24h: 1.69459509,
          percent_change_7d: -14.44117358,
          percent_change_30d: -18.73138646,
          percent_change_60d: -27.67891489,
          percent_change_90d: -15.19197705,
          market_cap: 320858734290.5502,
          market_cap_dominance: 10.0851,
          fully_diluted_market_cap: 320858734290.55,
          tvl: null,
          last_updated: '2025-02-09T07:03:00.000Z',
        },
      },
    ],
    totalUsdValue: 51.89230964608725,
  },
  zksync: {
    tokens: [
      {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
        chainId: 324,
        type: 'native',
        balance: 0,
        usdValue: 0,
        marketPrice: 2661.9371993169902,
        extra: {
          price: 2661.9371993169902,
          volume_24h: 15870901712.660969,
          volume_change_24h: -45.1796,
          percent_change_1h: 0.09795127,
          percent_change_24h: 1.69459509,
          percent_change_7d: -14.44117358,
          percent_change_30d: -18.73138646,
          percent_change_60d: -27.67891489,
          percent_change_90d: -15.19197705,
          market_cap: 320858734290.5502,
          market_cap_dominance: 10.0851,
          fully_diluted_market_cap: 320858734290.55,
          tvl: null,
          last_updated: '2025-02-09T07:03:00.000Z',
        },
      },
    ],
    totalUsdValue: 0,
  },
  optimism: {
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        chainId: 10,
        type: 'native',
        balance: 0.00010071009305984,
        usdValue: 1.1210183736953677e-11,
        marketPrice: 1.1131142268226086e-7,
        extra: {
          price: 1.1131142268226086e-7,
          volume_24h: 0,
          volume_change_24h: -100,
          percent_change_1h: 0,
          percent_change_24h: 0,
          percent_change_7d: -12.89818618,
          percent_change_30d: -40.88292055,
          percent_change_60d: -51.49245845,
          percent_change_90d: -71.06705534,
          market_cap: 0,
          market_cap_dominance: 0,
          fully_diluted_market_cap: 11131.14,
          tvl: null,
          last_updated: '2025-02-09T07:03:00.000Z',
        },
      },
      {
        chainId: 10,
        address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        logoURI: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
        extensions: {
          optimismBridgeAddress: '0x4200000000000000000000000000000000000010',
          opListId: 'default',
          opTokenId: 'ETH',
        },
        balance: 0.00010071009305984,
        usdValue: 1.1210183736953677e-11,
        marketPrice: 1.1131142268226086e-7,
        extra: {
          price: 1.1131142268226086e-7,
          volume_24h: 0,
          volume_change_24h: -100,
          percent_change_1h: 0,
          percent_change_24h: 0,
          percent_change_7d: -12.89818618,
          percent_change_30d: -40.88292055,
          percent_change_60d: -51.49245845,
          percent_change_90d: -71.06705534,
          market_cap: 0,
          market_cap_dominance: 0,
          fully_diluted_market_cap: 11131.14,
          tvl: null,
          last_updated: '2025-02-09T07:03:00.000Z',
        },
      },
    ],
    totalUsdValue: 2.2420367473907354e-11,
  },
  baseSepolia: {
    tokens: [
      {
        name: 'Sepolia Ether',
        symbol: 'ETH',
        decimals: 18,
        chainId: 84532,
        type: 'native',
        balance: 0.3010000029333186,
        usdValue: 801.2431048027239,
        marketPrice: 2661.9371993169902,
        extra: {
          price: 2661.9371993169902,
          volume_24h: 15870901712.660969,
          volume_change_24h: -45.1796,
          percent_change_1h: 0.09795127,
          percent_change_24h: 1.69459509,
          percent_change_7d: -14.44117358,
          percent_change_30d: -18.73138646,
          percent_change_60d: -27.67891489,
          percent_change_90d: -15.19197705,
          market_cap: 320858734290.5502,
          market_cap_dominance: 10.0851,
          fully_diluted_market_cap: 320858734290.55,
          tvl: null,
          last_updated: '2025-02-09T07:03:00.000Z',
        },
      },
    ],
    totalUsdValue: 801.2431048027239,
  },
};

export function formatPortfolio(portfolio: TMultichain<TChainTokenList>): string {
  const multichainPortfolio = aggregateMultichainTokenBalance(portfolio);
  const portfolioValue = multichainPortfolio.totalUsdValue;
  const balanceBySymbol = multichainPortfolio.aggregatedBalanceByToken;
  const balanceByChain = multichainPortfolio.aggregatedBalanceByChain;

  // Output builder
  const address = '0x...';

  let output = `Wallet Address: ${address}\n`;

  output += `\nTotal Value: ${formatNumberUSD(portfolioValue)}\n`;

  // Token distribution
  const highValueTokens = Object.values(balanceBySymbol).filter(
    token => token.totalUsdValue > 1 // exclude < 1$ assets
  );
  if (highValueTokens.length === 0) {
    output += 'No tokens found with value >1$\n';
  } else {
    output += `\nToken value distribution:\n`;
    highValueTokens.forEach(token => {
      output += `${token.marketData.symbol}:\t${formatNumberUSD(token.totalUsdValue)}\n`;
    });
  }

  // Chain distribution
  const highValueChains = Object.values(balanceByChain).filter(
    chain => chain.totalUsdValue > 1 // exclude < 1$ chains
  );
  if (highValueChains.length === 0) {
    output += 'No chain found with value >1$\n';
  } else {
    output += `\nChain value distribution:\n`;

    highValueChains.forEach(chain => {
      output += `${chain.chainId}:\t${formatNumberUSD(chain.totalUsdValue)}\n`;
    });
  }

  // return JSON.stringify(multichainTokenBalance, null, 2);
  return output;
}

console.log(formatPortfolio(mockResponse));
