import { Molecules } from '../../lib/ui';
import React from 'react';

const Dashboard: React.FC<any> = () => {
  return (
    <div>
      <Molecules.ConnectWalletWithPrivybutton />
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
