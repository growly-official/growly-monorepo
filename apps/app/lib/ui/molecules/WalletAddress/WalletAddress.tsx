import { TAddress } from 'chainsmith-types';
import { Avatar, Button, TooltipContainer } from '../../atoms';
import { Wallet } from 'lucide-react';

type Props = {
  address: TAddress;
  truncatedLength?: number;
  truncated?: boolean;
  className?: string;
};

export default ({ address, truncated, truncatedLength = 4, className }: Props) => {
  const first = address.slice(0, truncatedLength / 2);
  const second = address.slice(address.length - truncatedLength / 2);
  return (
    <TooltipContainer
      tooltipId={`wallet-address-${address}`}
      tooltipContent={`Address: ${address}`}>
      <Button className={`font-bold ${className} flex items-center gap-3 py-2 px-3`}>
        <Avatar address={address} size={35} />
        {truncated && first.length < address.length / 2 && truncatedLength > 0
          ? `${first}...${second}`
          : address}
        <Wallet size={18} />{' '}
      </Button>
    </TooltipContainer>
  );
};
