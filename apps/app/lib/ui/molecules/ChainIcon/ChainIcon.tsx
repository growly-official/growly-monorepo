import { ChainsmithApiService } from '@/core';
import { TChainMetadataListResponse, TChainName } from 'chainsmith/src/types';
import { getChainByName } from 'chainsmith/src/utils';
import { useState, useEffect } from 'react';

const ChainIcon = ({ chainName }: { chainName: TChainName }) => {
  const [metadata, setMetadata] = useState<TChainMetadataListResponse | undefined>();

  useEffect(() => {
    const fetchChainMetadata = async () => {
      try {
        const _metadata = await new ChainsmithApiService().getChainMetadataById(
          getChainByName(chainName).id
        );
        setMetadata(_metadata);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChainMetadata();
  }, [chainName]);

  return (
    <img
      src={metadata?.logoUrl}
      alt={`${chainName}-logo`}
      className="inline-block h-8 w-8 rounded-full"
    />
  );
};

export default ChainIcon;
