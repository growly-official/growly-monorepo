import { selectState, setState, useMagic, useMagicContext } from '@/core';
import { Molecules, ChatPage } from '@/ui';
import { useWallets } from '@privy-io/react-auth';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import type { UUID } from '@elizaos/core';

const Chat: React.FC<any> = () => {
  const { wallets } = useWallets();
  const { agentId } = useParams<{ agentId: UUID }>();

  const {
    query: { stateCheck },
    mutate: { letsDoSomeMagic },
  } = useMagic();
  const { selectedNetworks } = useMagicContext();

  useEffect(() => {
    if (wallets.length > 0) {
      const _currentWallet = wallets[0].address;
      letsDoSomeMagic(_currentWallet as any);
    }
  }, [selectState(selectedNetworks), wallets]);

  if (!agentId) return <div>No data.</div>;

  return (
    <div className="py-3 px-4 rounded-xl flex flex-col max-w-[80rem] shadow-xl w-full h-[100vh] bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg">
      <div className="flex justify-between items-center ">
        <Molecules.ConnectWalletWithPrivybutton />
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

      <ChatPage agentId={agentId} />
    </div>
  );
};

export default Chat;
