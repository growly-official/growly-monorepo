import { Atoms } from '../..';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button, Loadable } from '../../atoms';
import WalletAddress from '../WalletAddress/WalletAddress';
import { useMemo } from 'react';
import { TAddress } from 'chainsmith/src/types';
import { Card } from '@radix-ui/themes';
import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { Wallet } from 'lucide-react';

const ConnectWalletWithPrivyButton = () => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const { ready, authenticated, logout, login } = usePrivy();
  const { ready: readyWallets, wallets } = useWallets();

  const connectedWallet = useMemo(
    () => (wallets.length > 0 ? (wallets[0].address as TAddress) : undefined),
    [wallets]
  );
  const loginDisabled = useMemo(() => !ready || (ready && authenticated), [authenticated, ready]);

  return (
    <div>
      <Loadable
        isLoading={!readyWallets || connectedWallet === undefined}
        loadComponent={
          <Atoms.Button loading={!ready || !readyWallets} disabled={loginDisabled} onClick={login}>
            Connect your wallet <Wallet size={18} />
          </Atoms.Button>
        }>
        {connectedWallet && (
          <Popover
            transformMode={'relative'}
            isOpen={popoverOpen}
            positions={['bottom', 'right', 'left', 'top']}
            clickOutsideCapture={popoverOpen}
            onClickOutside={() => popoverOpen && setPopoverOpen(false)}
            padding={10}
            reposition={false}
            content={
              <div className="mt-[50px] min-height-[500px]">
                <Card className="bg-white shadow-xl rounded-xl py-3 px-4 max-w-[300px]">
                  {wallets.map(wallet => (
                    <WalletAddress
                      className="my-2"
                      highlighted={wallet.address == connectedWallet}
                      address={wallet.address as TAddress}
                      truncated
                      truncatedLength={15}
                    />
                  ))}
                  <Button onClick={() => logout()}>Disconnect wallet</Button>
                </Card>
              </div>
            }>
            <WalletAddress
              onClick={() => setPopoverOpen(true)}
              truncated
              className="py-7 relative"
              truncatedLength={15}
              address={connectedWallet}
            />
          </Popover>
        )}
      </Loadable>
    </div>
  );
};

export default ConnectWalletWithPrivyButton;
