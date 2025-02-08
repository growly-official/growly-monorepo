import type { ReactNode } from 'react';
import { Button, ButtonProps } from '@material-tailwind/react';
import { materialUiProps } from '@/ui';

type Props = ButtonProps & {
  children: ReactNode;
  disabled?: boolean;
  placeholder?: string;
};

export default function ({ children, disabled, placeholder = '', ...props }: Props) {
  return (
    <Button className="flex items-center gap-3" disabled={disabled} {...materialUiProps} {...props}>
      {children}
    </Button>
  );
}
