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
  name: string,
  size?: number,
  icon?: SVGElement | string,
  action?: Function,
}
export type Key = KeyWithoutString | string;
