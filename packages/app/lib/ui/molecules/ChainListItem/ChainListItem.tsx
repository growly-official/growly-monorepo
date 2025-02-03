import { TChain } from 'chainsmith-types';
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
        highlighted && 'bg-blue-400 text-white',
        'cursor-pointer',
        'hover:bg-blue-400 hover:text-white',
        'py-2 px-2',
        'rounded-xl',
      ])}>
      {chain.name} ({chain.nativeCurrency.symbol})
    </div>
  );
};
