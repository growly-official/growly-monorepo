import { useMemo, useState } from 'react';
import { Button, Modal } from '../../atoms';
import { EcosystemRegistry, Ecosystems } from 'chainsmith/src';
import { CircleCheck } from 'lucide-react';
import { Atoms } from '../..';
import ChainList from '../ChainList/ChainList';
import { IMultichain, TChainEcosystem, TChainName } from 'chainsmith/src/types';
import clsx from 'clsx';
import { countExistentialObject } from 'chainsmith/src/utils';
import { LocalEcosystemRegistry } from '@/core';

type Props = {
  open: boolean;
  handleOpen: (open: boolean) => void;
  handleOnClick: (ecosystem: TChainEcosystem, chains: TChainName[]) => void;
};

const ChainListModal = ({ open, handleOpen, handleOnClick }: Props) => {
  const [selectedChains, setSelectedChains] = useState<IMultichain<boolean>>({});
  const [selectedEcosystem, setSelectedEcosystem] = useState<TChainEcosystem>('evm');
  const [chainNameSearch, setChainNameSearch] = useState<TChainName | ''>('');

  const selectedChainCount = useMemo(
    () => countExistentialObject(selectedChains),
    [selectedChains]
  );

  return (
    <Modal open={open} handleOpen={handleOpen}>
      <div className="min-h-[300px] min-w-[400px]">
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
          ecosystemRegistry={LocalEcosystemRegistry}
          ecosystem={selectedEcosystem}
          selectedChains={selectedChains}
          searchQuery={{
            chainName: chainNameSearch,
            onChainNameChanged: setChainNameSearch,
          }}
          onChainSelected={chain =>
            setSelectedChains({
              ...selectedChains,
              [chain]: !selectedChains[chain],
            })
          }
        />
        <Button
          onClick={() => handleOnClick(selectedEcosystem, Object.keys(selectedChains) as any)}
          disabled={selectedChainCount === 0}
          className={clsx(
            'w-full mt-3 flex items-center rounded-xl justify-center',
            selectedChainCount > 0 && 'bg-black text-white'
          )}>
          <CircleCheck /> Select a network ({countExistentialObject(selectedChains)} selected)
        </Button>
        <Button
          onClick={() => handleOpen(false)}
          className="w-full bg-gray-100 mt-3 flex items-center rounded-xl justify-center">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ChainListModal;
