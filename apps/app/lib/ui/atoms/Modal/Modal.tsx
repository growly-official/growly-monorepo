import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogProps,
} from '@material-tailwind/react';
import { materialUiProps } from '@/ui';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  open: boolean;
  handleOpen?: (open: boolean) => void;
  footer: ReactNode;
  children: ReactNode;
};

const Modal = ({ title, open, footer, children, handleOpen }: Props & DialogProps) => {
  return (
    <Dialog open={open} handler={handleOpen as any} {...materialUiProps}>
      <DialogHeader {...materialUiProps}>{title}</DialogHeader>
      <DialogBody {...materialUiProps}>{children}</DialogBody>
      <DialogFooter {...materialUiProps}>{footer}</DialogFooter>
    </Dialog>
  );
};

export default Modal;
