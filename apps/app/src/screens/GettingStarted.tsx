import Dashboard from './Dashboard';
import React from 'react';
import { selectState, useMagicContext, useMagicInit } from '@/core';
import { ConnectWalletWithPrivyButton } from '../components';

const GettingStarted = () => {
  useMagicInit();
  const { agentWallet } = useMagicContext();
  return (
    <React.Fragment>
      {!selectState(agentWallet) ? (
        <div className="py-3 px-4 rounded-[50px] flex flex-col max-w-[500px] shadow-xl w-full bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg">
          <div className="py-7 px-7 rounded-[50px] flex flex-col justify-center items-center gap-4 shadow-xl w-full min-h-[400px] bg-white">
            <img src="/logo.png" width={100} className="rounded-[20px] shadow-xl" />
            <h1 className="font-bold text-2xl mt-5 mb-1">Growly</h1>
            <p className="mb-4 text-center">Manage your onchain portfolio smarter with AI!</p>
            <ConnectWalletWithPrivyButton />
            {/* <Molecules.SelectNetworkButton
              selectedNetworks={selectState(selectedNetworks)}
              onNetworkSelected={(ecosystem, chains) => {
                setState(selectedNetworks)({
                  ...selectState(selectedNetworks),
                  [ecosystem]: chains,
                });
              }}
            /> */}
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </React.Fragment>
  );
};

export default GettingStarted;
