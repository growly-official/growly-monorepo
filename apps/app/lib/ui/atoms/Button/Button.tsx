import { Button, ButtonProps } from '@radix-ui/themes';
import clsx from 'clsx';
import type { ReactNode } from 'react';

type Props = ButtonProps & {
  children: ReactNode;
  disabled?: boolean;
};

export default function ({ children, disabled, className, ...props }: Props) {
  return (
    <Button
      className={clsx('flex gap-2 py-3 items-center cursor-pointer', className)}
      size={'4'}
      variant="soft"
      disabled={disabled}
      {...props}>
      {children}
    </Button>
  );
}
