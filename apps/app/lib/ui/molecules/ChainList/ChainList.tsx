import { Card, Input, List } from '@material-tailwind/react';
import { materialUiProps } from '@/ui';
import { EcosystemRegistry } from 'chainsmith/src';
import Empty from '../../atoms/Empty/Empty';
import { useMemo, Fragment, useEffect, useState } from 'react';
import pluralize from 'pluralize';
import Fuse from 'fuse.js';
import ChainListItem from '../ChainListItem/ChainListItem';
import { TChain, TChainEcosystem } from 'chainsmith/src/types';

type Props = {
  searchQuery: {
    chainName: string;
    onChainNameChanged?: (chainName: string) => void;
  };
  selectedChain?: TChain;
  onChainSelected?: (chain: TChain) => void;
  ecosystem: TChainEcosystem;
  className?: string;
};

export default ({
  ecosystem = 'evm',
  selectedChain,
  searchQuery: { chainName = selectedChain?.name || '', onChainNameChanged },
  onChainSelected,
  ...props
}: Props) => {
  const [ecosystemChainResults, setEcosystemChainResult] = useState<TChain[]>([]);
  const ecosystemChains = useMemo(
    () => EcosystemRegistry[ecosystem].chains,
    [ecosystem, EcosystemRegistry]
  );

  useEffect(() => {
    const fuse = new Fuse(ecosystemChains, {
      shouldSort: true,
      includeMatches: false,
      minMatchCharLength: 1,
      threshold: 0.6,
      distance: 100,
      keys: ['name', 'id'],
    });

    const result = fuse.search(chainName);
    const chains = chainName.length > 0 ? result.map(r => r.item) : ecosystemChains;
    setEcosystemChainResult(chains as TChain[]);
  }, [ecosystemChains, chainName]);

  return (
    <div {...props}>
      <Input
        crossOrigin={undefined}
        size="lg"
        onChange={(e: any) => onChainNameChanged && onChainNameChanged(e.target.value)}
        label="Your selected network"
        value={chainName}
        {...materialUiProps}
      />
      {ecosystemChainResults.length > 0 ? (
        <Fragment>
          <h2 className="mb-3 mt-3 text-center">
            There {pluralize('is', ecosystemChainResults.length)} {ecosystemChainResults.length}{' '}
            {pluralize('chain', ecosystemChainResults.length)} found
          </h2>
          <Card className="max-h-[300px] overflow-scroll py-2 mt-3" {...materialUiProps}>
            <List {...materialUiProps}>
              {ecosystemChainResults.map(chain => (
                <div onClick={() => onChainSelected && onChainSelected(chain)}>
                  <ChainListItem chain={chain} highlighted={selectedChain?.id === chain.id} />
                </div>
              ))}
            </List>
          </Card>
        </Fragment>
      ) : (
        <Empty
          title="No networks found."
          subtitle="Please try again by selecting other ecosystems."
        />
      )}
    </div>
  );
};
