import { UseState } from './contexts';

export const mustBeBoolean = (v: any) => !!v;

export const delayMs = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export function selectState<T>(s: UseState<T>) {
  return s[0];
}

export function setState<T>(s: UseState<T>) {
  return s[1];
}

export function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
