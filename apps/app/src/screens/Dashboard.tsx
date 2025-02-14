import { formatNumberUSD, selectState, setState, useMagicContext, useMagic } from '@/core';
import { Atoms, Molecules } from '@/ui';
import { ThreeStageState } from '@/core';
import React, { useState } from 'react';
import animationData from '../assets/animation/pink-loading.json';
import Lottie from 'react-lottie';
import Countup from 'react-countup';
import { ConnectWalletWithPrivyButton } from '../components';
import { TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const Dashboard: React.FC<any> = () => {
  const {
    query: { stateCheck },
  } = useMagic();
  const { tokenPortfolio, selectedNetworks } = useMagicContext();
  const [chatWithAiMessage, setChatWithAiMessage] = useState('');

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
              <div className="mb-5 flex justify-between">
                <div>
                  <div className="text-gray-500 mb-2">Total Balance</div>
                  <h1 className="text-3xl font-bold">
                    <Countup
                      end={selectState(tokenPortfolio).totalUsdValue}
                      duration={3}
                      formattingFn={formatNumberUSD}
                    />
                  </h1>
                </div>
                <div className="flex gap-3">
                  <TextField.Root
                    value={chatWithAiMessage}
                    className="rounded-2xl min-w-[350px]"
                    placeholder="Speak with AI to manage portfolio better..."
                    onChange={e => setChatWithAiMessage(e.target.value as any)}>
                    <TextField.Slot className="py-2 px-3 rounded-xl">
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <Atoms.Button color="green" className="rounded-2xl" size="2">
                    Send Message
                  </Atoms.Button>
                </div>
              </div>
              <div className="mt-10 overflow-scroll max-h-[700px] pb-[15rem]">
                {Object.keys(selectState(tokenPortfolio).chainRecordsWithTokens).length > 0 ? (
                  <Molecules.TokenPortfolioTable
                    multichainTokenData={selectState(tokenPortfolio).chainRecordsWithTokens}
                  />
                ) : (
                  <Atoms.Empty
                    title="No tokens found"
                    subtitle="Send tokens to this address to manage your portfolio"
                  />
                )}
              </div>
            </div>
          </Atoms.Loadable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
