import { Constants } from 'chainsmith-data';
import { Atoms, Molecules } from 'chainsmith-ui';
import { useEffect, useState } from 'react';
import { useChainsmithSdk, services } from 'chainsmith-core';
import { TChain, TPortfolio, TToken } from 'chainsmith-types';

const useAccountBalance = (address: string, chains: TChain[]) => {
  const [tokens, setTokens] = useState<TToken[]>([]);
  const [refreshing, setRefreshing] = useState(+new Date());
  const chainsmithSdk = useChainsmithSdk();

  useEffect(() => {
    const init = async () => {
      let _balances: TToken[] = [];
      for (const chain of chains) {
        const client = chainsmithSdk.createClient({ chain });
        const balance = await client.getBalance({
          address: address as any,
        });
        const tokenList = await services.getTokenMetadataList(chain.id);
        const tokens = await services.getBatchLatestTokens(client, tokenList, address as any);

        const prices = await services.getTokenPrices(tokens.map(token => token.symbol));

        const formattedBalance = chainsmithSdk.formatReadableToken(balance);
        _balances.push({
          chainId: chain.id,
          address: address as any,
          balance: formattedBalance,
          ...chain.nativeCurrency,
        });
        _balances = _balances.concat(tokens);
      }
      setTokens(_balances);
    };
    init();
  }, [address, refreshing]);

  return {
    tokens,
    setRefreshing,
  };
};

export default function MultichainPortfolio(portfolio: TPortfolio) {
  const { tokens, setRefreshing } = useAccountBalance(portfolio.address, portfolio.chainList);

  return (
    <div>
      <Molecules.WalletAddress truncated truncatedLength={20} address={portfolio.address} />
      {tokens.map(token => (
        <div>
          {token.balance.toString()} {token.symbol}
        </div>
      ))}
      <Atoms.Button onClick={() => setRefreshing(+new Date())}>Refresh</Atoms.Button>
    </div>
  );
}
