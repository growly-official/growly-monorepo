import { useWallets } from '@privy-io/react-auth';
import { useMagic } from './useMagic';
import { useMagicContext } from './useMagicContext';
import { useEffect } from 'react';
import { selectState, setState } from '../utils';

export const useMagicInit = () => {
  const { wallets } = useWallets();
  const {
    mutate: { letsDoSomeMagic },
  } = useMagic();
  const { selectedNetworks, userWallet, agentWallet } = useMagicContext();

  useEffect(() => {
    if (wallets.length > 0) {
      const _userWallet = wallets.find(wallet => wallet.walletClientType !== 'privy');
      if (_userWallet) {
        setState(userWallet)(_userWallet);
        letsDoSomeMagic(_userWallet.address as any);
        // letsDoSomeMagic('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as any);
        const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
        if (embeddedWallet) setState(agentWallet)(embeddedWallet);
      }
    }
  }, [selectState(selectedNetworks), wallets]);
};
