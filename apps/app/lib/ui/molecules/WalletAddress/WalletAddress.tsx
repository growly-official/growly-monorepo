import { TAddress } from 'chainsmith/src/types';
import { Avatar, Button } from '../../atoms';
import { ButtonProps } from '@radix-ui/themes';
import { ChevronDownIcon } from 'lucide-react';

type Props = {
  address: TAddress;
  truncatedLength?: number;
  truncated?: boolean;
  className?: string;
} & ButtonProps;

export default ({ address, truncated, truncatedLength = 4, className, ...props }: Props) => {
  const first = address.slice(0, truncatedLength / 2);
  const second = address.slice(address.length - truncatedLength / 2);
  return (
    <Button
      {...props}
      data-popover-target="popover-default"
      style={{ textTransform: 'lowercase' }}
      className={`${className} hover:bg-gray-200 flex items-center cursor-pointer gap-3 py-7 px-3 rounded-xl shadow-xl`}>
      <Avatar address={address} size={35} />
      {truncated && first.length < address.length / 2 && truncatedLength > 0
        ? `${first}...${second}`
        : address}
      <ChevronDownIcon />
    </Button>
  );
};
