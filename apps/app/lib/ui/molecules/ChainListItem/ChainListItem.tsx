import { TChain } from 'chainsmith/src/types';
import clsx from 'clsx';

interface Props {
  chain: TChain;
  highlighted?: boolean;
}

export default ({ chain, highlighted }: Props) => {
  return (
    <div
      key={`${chain.id}-${chain.name}`}
      className={clsx([
        highlighted ? 'bg-green text-white' : 'hover:bg-gray-200',
        'cursor-pointer',
        'py-2 px-2',
        'rounded-xl',
      ])}>
      {chain.name} ({chain.nativeCurrency.symbol})
    </div>
  );
};
