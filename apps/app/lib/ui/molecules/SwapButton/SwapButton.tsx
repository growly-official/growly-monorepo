import { TChainId, TMarketToken } from 'chainsmith/src/types';
import { Button, TooltipContainer } from '../../atoms';
import { ArrowRightLeftIcon } from 'lucide-react';
import SwapWidgetModal from '../SwapWidgetModal/SwapWidgetModal';
import { useState } from 'react';

type Props = {
  token: TMarketToken;
  supportedChains: TChainId[];
};

const SwapButton = ({ token, supportedChains }: Props) => {
  const [openSwapModal, setOpenSwapModal] = useState<boolean>(false);
  return (
    <TooltipContainer tooltipId={`${token.chainId}-${token.name}-swap`} tooltipContent={'Swap'}>
      <Button onClick={() => setOpenSwapModal(true)} size={'2'} color="green">
        <ArrowRightLeftIcon size={10} />
      </Button>
      <SwapWidgetModal
        token={token}
        supportedChains={supportedChains}
        open={openSwapModal}
        handleOpen={open => setOpenSwapModal(open)}
      />
    </TooltipContainer>
  );
};

export default SwapButton;
