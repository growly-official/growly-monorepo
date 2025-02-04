export * from './array.util';
export * from './number.util';
export * from './chain.util';

export const getVariableName = (v: object) => {
  return Object.keys(v)[0];
};
