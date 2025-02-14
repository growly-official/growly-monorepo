import React from 'react';
import { selectState, setState, useMagicInit, useMagicContext } from '@/core';
import { Molecules, ChatPage } from '@/ui';
import { useParams } from 'react-router';
import type { UUID } from '@elizaos/core';
import { ConnectWalletWithPrivyButton } from '../components';

const Chat: React.FC<any> = () => {
  useMagicInit();
  const { agentId } = useParams<{ agentId: UUID }>();
  const { selectedNetworks } = useMagicContext();

  if (!agentId) return <div>No data.</div>;

  return (
    <div className="py-3 px-4 rounded-xl flex flex-col max-w-[80rem] shadow-xl w-full h-[100vh] bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg">
      <div className="flex justify-between items-center ">
        <ConnectWalletWithPrivyButton />
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
