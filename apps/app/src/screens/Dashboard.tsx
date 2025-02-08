import { Molecules } from '../../lib/ui';
import React, { useState } from 'react';
import { ChainListModal } from '../../lib/ui/molecules';
import { Button } from '../../lib/ui/atoms';
import { IMultichain, TChainName } from 'chainsmith/src/types';
import { countExistentialObject, iterateObject } from 'chainsmith/src/utils';
import pluralize from 'pluralize';

const Dashboard: React.FC<any> = () => {
  const [openChainList, setOpenChainList] = useState<boolean>(false);
  const [selectedNetworks, setSelectedNetworks] = useState<IMultichain<TChainName[]>>({});
  return (
    <div>
      <Molecules.ConnectWalletWithPrivybutton />
      {countExistentialObject(selectedNetworks) > 0 ? (
        <div>
          {iterateObject(selectedNetworks, network => (
            <Button onClick={() => setOpenChainList(true)}>
              {network}: {network.length} {pluralize('chain', network.length)} selected
            </Button>
          ))}
        </div>
      ) : (
        <Button onClick={() => setOpenChainList(true)}>Select your network</Button>
      )}
      {openChainList && (
        <ChainListModal
          open={true}
          handleOnClick={(ecosystem, chains) => {
            setSelectedNetworks({
              [ecosystem.toUpperCase()]: chains,
              ...selectedNetworks,
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
