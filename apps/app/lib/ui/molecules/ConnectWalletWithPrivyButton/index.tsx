import { Atoms } from '../..';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button, Loadable } from '../../atoms';
import WalletAddress from '../WalletAddress/WalletAddress';
import { useMemo } from 'react';
import { TAddress } from 'chainsmith/src/types';
import { Card } from '@radix-ui/themes';
import { useState } from 'react';
import { Popover } from 'react-tiny-popover';

const ConnectWalletWithPrivyButton = () => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const { ready, authenticated, logout, login } = usePrivy();
  const { ready: readyWallets, wallets } = useWallets();

  const loginDisabled = useMemo(() => !ready || (ready && authenticated), [authenticated, ready]);

  return (
    <div>
      <Loadable
        isLoading={!readyWallets}
        loadComponent={
          <Atoms.Button disabled={loginDisabled} onClick={login}>
            Log in
          </Atoms.Button>
        }>
        {wallets.length > 0 && (
          <Popover
            isOpen={popoverOpen}
            positions={['bottom']}
            padding={10}
            reposition={false}
            content={
              <div className="mt-[60px]">
                <Card className="bg-white shadow-xl rounded-xl py-3 px-4 max-w-[300px]">
                  <Button onClick={() => logout()}>Disconnect wallet</Button>
                </Card>
              </div>
            }>
            <WalletAddress
              onClick={() => setPopoverOpen(!popoverOpen)}
              truncated
              truncatedLength={15}
              address={wallets[0].address as TAddress}
            />
          </Popover>
        )}
      </Loadable>
    </div>
  );
};

export default ConnectWalletWithPrivyButton;
