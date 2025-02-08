import { Molecules } from '../../lib/ui';
import { useEffect, useState } from 'react';
import { TChain, TPortfolio, TToken } from 'chainsmith/src/types';

const useAccountBalance = (address: string, _chains: TChain[]) => {
  const [tokens, setTokens] = useState<TToken[]>([]);
  const [refreshing, setRefreshing] = useState(+new Date());
  useEffect(() => {
    const init = async () => {
      setTokens([]);
    };
    init();
  }, [address, refreshing]);

  return {
    tokens,
    setRefreshing,
  };
};

export default function MultichainPortfolio(portfolio: TPortfolio) {
  const { tokens } = useAccountBalance(portfolio.address, portfolio.chainList);
  return (
    <div>
      <Molecules.WalletAddress truncated truncatedLength={20} address={portfolio.address} />
      {tokens.map(token => (
        <div>
          {token.balance.toString()} {token.symbol}
        </div>
      ))}
    </div>
  );
}
