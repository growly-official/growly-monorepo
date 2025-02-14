import { Modal } from '../../atoms';
import { SKApp, darkTheme } from '@stakekit/widget';

type Props = {
  open: boolean;
  handleOpen: (open: boolean) => void;
};

const SwapWidgetModal = ({ open, handleOpen }: Props) => {
  return (
    <Modal open={open} handleOpen={handleOpen}>
      <SKApp apiKey={import.meta.env.VITE_STAKEKIT_API_KEY} theme={darkTheme} />
    </Modal>
  );
};

export default SwapWidgetModal;
