import { useContext } from 'react';
import { MagicContext } from '../contexts/MagicContext';

export const useMagicContext = () => {
  return useContext(MagicContext);
};
