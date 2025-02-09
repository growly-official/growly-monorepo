import { Molecules, Atoms } from '@/ui';
import React, { useState } from 'react';
import { TChainName, TMultiEcosystem } from 'chainsmith/src/types';
import { countExistentialObject, iterateObject } from 'chainsmith/src/utils';
import pluralize from 'pluralize';

const Dashboard: React.FC<any> = () => {
  const [openChainList, setOpenChainList] = useState<boolean>(false);
  const [selectedNetworks, setSelectedNetworks] = useState<TMultiEcosystem<TChainName[]>>({});
  const defaultEcosystemChains = (selectedNetworks['evm'] || []).reduce<Record<string, true>>(
    (acc, item) => {
      acc[item] = true;
      return acc;
    },
    {}
  );

  return (
    <div className="py-5 px-5 rounded-xl flex flex-col max-w-[80rem] shadow-xl w-full h-[100vh] bg-white">
      <div className="flex justify-between items-center">
        <Molecules.ConnectWalletWithPrivybutton />
        <div>
          {countExistentialObject(selectedNetworks) > 0 ? (
            <div>
              {iterateObject(selectedNetworks, (network, chains) => (
                <Atoms.Button onClick={() => setOpenChainList(true)}>
                  {network.toUpperCase()}: {chains.length} {pluralize('chain', chains.length)}{' '}
                  selected
                </Atoms.Button>
              ))}
            </div>
          ) : (
            <Atoms.Button onClick={() => setOpenChainList(true)}>Select your network</Atoms.Button>
          )}
          {openChainList && (
            <Molecules.ChainListModal
              open={true}
              ecosystemDisabled
              defaultEcosystem="evm"
              defaultChains={defaultEcosystemChains}
              handleOnClick={(ecosystem, chains) => {
                setSelectedNetworks({
                  ...selectedNetworks,
                  [ecosystem]: chains,
                });
                setOpenChainList(false);
              }}
              handleOpen={() => setOpenChainList(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
