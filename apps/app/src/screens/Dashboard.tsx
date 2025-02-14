import {
  formatNumberUSD,
  selectState,
  setState,
  useMagicContext,
  useMagic,
  useMagicInit,
} from '@/core';
import { Atoms, Molecules } from '@/ui';
import { ThreeStageState } from '@/core';
import React from 'react';
import animationData from '../assets/animation/pink-loading.json';
import Lottie from 'react-lottie';
import Countup from 'react-countup';
import { ConnectWalletWithPrivyButton } from '../components';

const Dashboard: React.FC<any> = () => {
  useMagicInit();
  const {
    query: { stateCheck },
  } = useMagic();
  const { tokenPortfolio, selectedNetworks } = useMagicContext();

  return (
    <div className="py-3 px-4 rounded-xl flex flex-col max-w-[80rem] shadow-xl w-full h-[100vh] bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg">
      <div className="py-5 px-7 rounded-xl flex flex-col shadow-xl w-full h-[100vh] bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ConnectWalletWithPrivyButton />
          </div>
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
