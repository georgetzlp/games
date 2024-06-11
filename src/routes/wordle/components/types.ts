export type LetterState = 'correct' | 'present' | 'absent';

export type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Char = Letter | Digit;

export type KeyWithoutString = {
  name: string,
  size?: number,
  icon?: SVGElement | string,
  action?: Function,
}
export type Key = KeyWithoutString | string;

export type GameState = 'playing' | 'win' | 'loss';
