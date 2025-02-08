import type { ReactNode } from 'react';
import ReactModal from 'react-modal';

type Props = {
  title: string;
  open: boolean;
  handleOpen?: (open: boolean) => void;
  children: ReactNode;
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Modal = ({ title, open, children, handleOpen }: Props) => {
  return (
    <ReactModal
      onRequestClose={() => {
        if (handleOpen) handleOpen(false);
      }}
      isOpen={open}
      style={customStyles}
      contentLabel={title}>
      {children}
    </ReactModal>
  );
};

export default Modal;
