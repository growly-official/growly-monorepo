import { selectState, setState, useMagic, useMagicContext } from '@/core';
import { Molecules } from '@/ui';
import { useWallets } from '@privy-io/react-auth';
import React, { useEffect } from 'react';

const Dashboard: React.FC<any> = () => {
  const { wallets } = useWallets();
  const {
    mutate: { letsDoSomeMagic },
  } = useMagic();
  const { tokenPortfolio, selectedNetworks } = useMagicContext();

  useEffect(() => {
    if (wallets.length > 0) {
      // const _currentWallet = wallets[0].address;
      letsDoSomeMagic('0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1' as any);
    }
  }, [selectedNetworks]);

  return (
    <div className="py-5 px-5 rounded-xl flex flex-col max-w-[80rem] shadow-xl w-full h-[100vh] bg-white">
      <div className="flex justify-between items-center">
        <Molecules.ConnectWalletWithPrivybutton />
        <Molecules.SelectNetworkButton
          selectedNetworks={selectState(selectedNetworks)}
          onNetworkSelected={(ecosystem, chains) => {
            setState(selectedNetworks)({
              ...selectState(selectedNetworks),
              [ecosystem]: chains,
            });
          }}
        />
      </div>
      <Molecules.TokenPortfolioTable
        multichainTokenData={selectState(tokenPortfolio).chainRecordsWithTokens}
      />
    </div>
  );
};

export default Dashboard;
