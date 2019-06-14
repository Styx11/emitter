import {
  Warn
} from '../interface';

export const warn: Warn = (msg: string): void => {
  if (process.env.NODE_ENV === 'production') return;
  const warnMsg: string = `[Emitter Warning]: ${msg}`;
  console.error(warnMsg);
}