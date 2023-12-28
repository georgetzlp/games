export type LetterParams = {
  letter: string,
  type: 'active' |   // the current guess
        'inactive' | // future
        'correct' |
        'present' |
        'absent',
  position: number,
};

export type KeyWithoutString = {
  size?: number,
} & ({
  key: string,
  action?: Function,
} | {
  key: string,
  icon: SVGElement | string,
} | {
  icon: SVGElement | string,
  action: Function,
});

export type Key = KeyWithoutString | string;
