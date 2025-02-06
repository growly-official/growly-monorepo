export * from './array.util';
export * from './number.util';
export * from './chain.util';

export const getVariableName = (v: object) => {
  return Object.keys(v)[0];
};

export const objectToQueryString = (obj: Record<any, any>): string => {
  return Object.entries(obj)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};
