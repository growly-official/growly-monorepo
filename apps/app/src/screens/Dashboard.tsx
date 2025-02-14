import { formatNumberUSD, selectState, setState, useMagic, useMagicContext } from '@/core';
import { Atoms, Molecules } from '@/ui';
import { ThreeStageState } from '@/core';
import { useWallets } from '@privy-io/react-auth';
import React, { useEffect } from 'react';
import animationData from '../assets/animation/pink-loading.json';
import Lottie from 'react-lottie';
import Countup from 'react-countup';

const Dashboard: React.FC<any> = () => {
  const { wallets } = useWallets();
  const {
    query: { stateCheck },
    mutate: { letsDoSomeMagic },
  } = useMagic();
  const { tokenPortfolio, selectedNetworks } = useMagicContext();

  useEffect(() => {
    if (wallets.length > 0) {
      // const _currentWallet = wallets[0].address;
      letsDoSomeMagic('0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1' as any);
    }
  }, [selectState(selectedNetworks), wallets]);

  return (
    <div className="py-3 px-4 rounded-xl flex flex-col max-w-[80rem] shadow-xl w-full h-[100vh] bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg">
      <div className="py-5 px-7 rounded-xl flex flex-col shadow-xl w-full h-[100vh] bg-white">
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
        <div className="mt-7">
          <Atoms.Loadable
            isLoading={stateCheck('GetTokenPortfolio', ThreeStageState.InProgress)}
            loadComponent={
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: animationData,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice',
                  },
                }}
                speed={2}
                height={400}
                width={400}
              />
            }>
            <div className="px-5">
              <div className="mb-5">
                <h1 className="text-3xl font-bold">
                  <Countup
                    end={selectState(tokenPortfolio).totalUsdValue}
                    duration={3}
                    formattingFn={formatNumberUSD}
                  />
                </h1>
              </div>
              <div className="mt-10">
                <Molecules.TokenPortfolioTable
                  multichainTokenData={selectState(tokenPortfolio).chainRecordsWithTokens}
                />
              </div>
            </div>
          </Atoms.Loadable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
