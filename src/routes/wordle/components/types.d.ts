export type LetterState = 'correct' |
  'present' |
  'absent';

export type KeyWithoutString = {
  name: string,
  size?: number,
  icon?: SVGElement | string,
  action?: Function,
}
export type Key = KeyWithoutString | string;

export type StopState = 'win' | 'loss';
