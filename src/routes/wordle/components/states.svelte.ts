import type { LetterState } from './types';

let inputState = $state<Letter[]>([]);
export const input = {
  get chars() { return inputState },
  add: (char: Letter) => inputState = [...inputState, char],
  remove: (amount = 1) => inputState = inputState.slice(0, -amount),
  clear: () => inputState = [],
  get length() { return inputState.length },
};

let letterState = $state<Record<string, LetterState>>({});
export const letter = {
  get letters() { return letterState },
  get: (key: string) => letterState[key],
  set: (key: string, value: LetterState) => letterState[key] = value,
  clear: () => letterState = {},
};

let guessState = $state<{ letter: Letter, state: LetterState }[][]>([]);
export const guess = {
  get all() { return guessState },
  get: (guess: number) => guessState[guess],
  set: (guess: number, value: typeof guessState[number]) => guessState[guess] = value,
  clear: () => guessState = [],
};

export {
  input as inputState,
  letter as letterState,
  guess as guessState,
};
