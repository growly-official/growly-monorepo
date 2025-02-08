import type { ReactNode } from 'react';
import { Button, ButtonProps } from '@radix-ui/themes';

type Props = ButtonProps & {
  children: ReactNode;
  disabled?: boolean;
  placeholder?: string;
};

export default function ({ children, disabled, placeholder = '', ...props }: Props) {
  return (
    <Button className="flex items-center" size={'3'} disabled={disabled} {...props}>
      {children}
    </Button>
  );
}
