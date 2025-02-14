import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { Modal } from '../../atoms';
import { TChainId, TMarketToken } from 'chainsmith/src/types';

type Props = {
  token: TMarketToken;
  supportedChains: TChainId[];
  open: boolean;
  handleOpen: (open: boolean) => void;
};

const widgetConfig: WidgetConfig = {
  integrator: 'Growly',
  variant: 'wide',
  appearance: 'light',
  theme: {
    container: {
      border: 'none',
    },
  },
};

const SwapWidgetModal = ({ open, handleOpen, token, supportedChains }: Props) => {
  return (
    <Modal open={open} handleOpen={handleOpen}>
      <LiFiWidget
        integrator="Growly"
        config={{
          ...widgetConfig,
          fromChain: token.chainId,
          fromToken: token.symbol,
          chains: {
            from: { allow: supportedChains },
            to: { allow: supportedChains },
          },
        }}
      />
    </Modal>
  );
};

export default SwapWidgetModal;
