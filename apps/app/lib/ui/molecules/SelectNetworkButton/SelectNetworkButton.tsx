import { countExistentialObject, iterateObject } from 'chainsmith/src/utils';
import { TChainEcosystem, TChainName, TMultiEcosystem } from 'chainsmith/src/types';
import React, { useState } from 'react';
import { Atoms, Molecules } from '@/ui';
import pluralize from 'pluralize';
import ChainIcon from '../ChainIcon/ChainIcon';

type Props = {
  selectedNetworks: TMultiEcosystem<TChainName[]>;
  onNetworkSelected: (ecosystem: TChainEcosystem, chains: TChainName[]) => void;
};

const SelectNetworkButton = ({ selectedNetworks, onNetworkSelected }: Props) => {
  const [openChainList, setOpenChainList] = useState<boolean>(false);
  const defaultEcosystemChains = (selectedNetworks['evm'] || []).reduce<Record<string, true>>(
    (acc, item) => {
      acc[item] = true;
      return acc;
    },
    {}
  );
  return (
    <React.Fragment>
      {countExistentialObject(selectedNetworks) > 0 ? (
        <div className="flex gap-2 items-center">
          {iterateObject(selectedNetworks, (network, chains) => (
            <Atoms.Button onClick={() => setOpenChainList(true)}>
              {network.toUpperCase()}: {chains.length} {pluralize('chain', chains.length)} selected
            </Atoms.Button>
          ))}
          {(selectedNetworks['evm'] || []).map(chainName => (
            <ChainIcon size={20} chainName={chainName} />
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
          handleOnClick={(...props) => {
            onNetworkSelected(...props);
            setOpenChainList(false);
          }}
          handleOpen={() => setOpenChainList(false)}
        />
      )}
    </React.Fragment>
  );
};

export default SelectNetworkButton;
