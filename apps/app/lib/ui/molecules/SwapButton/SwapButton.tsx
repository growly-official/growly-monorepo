import { TChainId, TMarketToken } from 'chainsmith/src/types';
import { Button, TooltipContainer } from '../../atoms';
import SwapWidgetModal from '../SwapWidgetModal/SwapWidgetModal';
import { useState } from 'react';
import { ToAddress } from '@lifi/widget';
import { ButtonProps } from '@radix-ui/themes';

type Props = {
  type: 'TRANSFER' | 'SWAP';
  token: TMarketToken;
  supportedChains: TChainId[];
  tooltipContent: string;
  children: React.ReactNode;
  toAddress?: ToAddress;
  buttonProps?: ButtonProps;
};

const SwapButton = ({
  type,
  children,
  token,
  supportedChains,
  toAddress,
  tooltipContent,
  buttonProps,
}: Props) => {
  const [openSwapModal, setOpenSwapModal] = useState<boolean>(false);
  return (
    <TooltipContainer
      tooltipId={`${token.chainId}-${token.name}-swap`}
      tooltipContent={tooltipContent}>
      <Button {...buttonProps} onClick={() => setOpenSwapModal(true)} size={'2'} color="green">
        {children}
      </Button>
      <SwapWidgetModal
        type={type}
        token={token}
        supportedChains={supportedChains}
        open={openSwapModal}
        toAddress={toAddress}
        handleOpen={open => setOpenSwapModal(open)}
      />
    </TooltipContainer>
  );
};

export default SwapButton;
