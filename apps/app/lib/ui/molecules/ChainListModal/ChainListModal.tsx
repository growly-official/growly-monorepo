import { useEffect, useState } from 'react';
import { Button, Modal } from '../../atoms';
import { EcosystemRegistry, Ecosystems } from 'chainsmith-core';
import { CircleCheck } from 'lucide-react';
import { Option, Select } from '@material-tailwind/react';
import ChainList from '../ChainList/ChainList';
import { materialUiProps } from 'chainsmith-ui';
import { TChain, TChainEcosystem } from 'chainsmith-types';

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
    <Modal open={open} handler={handleOpen} title="Select a network" footer={<></>}>
      <Select
        onChange={(value: any) => {
          setSelectedEcosystem(value);
        }}
        value={selectedEcosystem}
        label="Ecosystem"
        {...materialUiProps}>
        {Ecosystems.map(ecosystem => (
          <Option key={ecosystem} value={ecosystem}>
            {EcosystemRegistry[ecosystem].name}
          </Option>
        ))}
      </Select>
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
