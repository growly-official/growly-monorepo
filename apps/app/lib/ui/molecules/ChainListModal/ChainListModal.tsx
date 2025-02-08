import { useEffect, useState } from 'react';
import { Button, Modal } from '../../atoms';
import { EcosystemRegistry, Ecosystems } from 'chainsmith/src';
import { CircleCheck } from 'lucide-react';
import { Atoms } from '@/ui';
import ChainList from '../ChainList/ChainList';
import { TChain, TChainEcosystem } from 'chainsmith/src/types';

type Props = {
  open: boolean;
  handleOpen: (open: boolean) => void;
  handleOnClick: (ecosystem: TChainEcosystem, chain: TChain) => void;
};

const ChainListModal = ({ open, handleOpen, handleOnClick }: Props) => {
  const [selectedChain, setSelectedChain] = useState<TChain>();
  const [selectedEcosystem, setSelectedEcosystem] = useState<TChainEcosystem>('evm');
  const [chainNameSearch, setChainNameSearch] = useState<string>('');

  useEffect(() => {
    setChainNameSearch(selectedChain?.name || '');
  }, [selectedChain]);

  return (
    <Modal open={open} handleOpen={handleOpen} title="Select a network">
      <Atoms.Select
        value={selectedEcosystem}
        onValueChange={v => setSelectedEcosystem(v as TChainEcosystem)}
        options={Ecosystems.map(ecosystem => ({
          label: EcosystemRegistry[ecosystem].name,
          value: ecosystem,
        }))}
      />
      <ChainList
        className="mt-5"
        ecosystem={selectedEcosystem}
        selectedChain={selectedChain}
        searchQuery={{
          chainName: chainNameSearch,
          onChainNameChanged: setChainNameSearch,
        }}
        onChainSelected={chain => setSelectedChain(chain)}
      />
      <Button
        onClick={() => handleOnClick(selectedEcosystem, selectedChain!)}
        disabled={!selectedChain}
        className="w-full mt-3 flex items-center gap-2 justify-center">
        <CircleCheck /> Select a network
      </Button>
    </Modal>
  );
};

export default ChainListModal;
