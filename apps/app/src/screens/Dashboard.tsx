import { Molecules } from '../../lib/ui';
import React, { useState } from 'react';
import { ChainListModal } from '../../lib/ui/molecules';
import { Button } from '../../lib/ui/atoms';
import { TChainName, IMultiEcosystem } from 'chainsmith/src/types';
import { countExistentialObject, iterateObject } from 'chainsmith/src/utils';
import pluralize from 'pluralize';

const Dashboard: React.FC<any> = () => {
  const [openChainList, setOpenChainList] = useState<boolean>(false);
  const [selectedNetworks, setSelectedNetworks] = useState<IMultiEcosystem<TChainName[]>>({});
  const defaultEcosystemChains = (selectedNetworks['evm'] || []).reduce<Record<string, true>>(
    (acc, item) => {
      acc[item] = true;
      return acc;
    },
    {}
  );

  return (
    <div>
      <Molecules.ConnectWalletWithPrivybutton />
      {countExistentialObject(selectedNetworks) > 0 ? (
        <div>
          {iterateObject(selectedNetworks, (network, chains) => (
            <Button onClick={() => setOpenChainList(true)}>
              {network.toUpperCase()}: {chains.length} {pluralize('chain', chains.length)} selected
            </Button>
          ))}
        </div>
      ) : (
        <Button onClick={() => setOpenChainList(true)}>Select your network</Button>
      )}
      {openChainList && (
        <ChainListModal
          open={true}
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
      {/* <MultichainPortfolio
            address={Wallets.ETH_MAINNET_WALLET_VITALIK}
            chainList={
              // TODO: In production, chain type builder should not be used directly.
              buildEvmChains(['base', 'mainnet'], alchemy(''))
            }
          /> */}
    </div>
  );
};

export default Dashboard;
