import { ChainsmithApiService } from '@/core';
import { TChainMetadataListResponse, TChainName } from 'chainsmith/src/types';
import { getChainByName } from 'chainsmith/src/utils';
import { useState, useEffect } from 'react';

const ChainIcon = ({ chainName, size }: { chainName: TChainName; size?: number }) => {
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
      style={{
        objectFit: 'contain',
        width: size || 30,
        height: size || 30,
      }}
      className="inline-block rounded-full"
    />
  );
};

export default ChainIcon;
