import { browser } from '$app/environment';
import type { GameState, Letter, LetterState } from './types';

const session: Storage = browser
  ? sessionStorage
  // stub for server
  : {
    clear: () => {},
    getItem: () => '',
    key: () => '',
    length: 0,
    removeItem: () => {},
    setItem: () => {},
  };

const num = browser ? window.location.pathname.split('/').pop() ?? '5' : '';
const length = /^\d+$/.test(num) ? num : 5;

const date = new Date();
const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;

function get<T>(name: string, defaultValue: T, reviver: (this: any, key: any, value: any) => any): T { // TODO: Improve type
  const lastDate = session.getItem(`wordle-day-${length}`);
  if (!lastDate) session.setItem(`wordle-day-${length}`, dayOfYear.toString());

  if (dayOfYear - Number(lastDate) > 1) {
    session.removeItem(`wordle-game-state-${length}`);
    session.removeItem(`wordle-input-${length}`);
    session.removeItem(`wordle-letters-${length}`);
    session.removeItem(`wordle-guesses-${length}`);

    session.setItem(`wordle-day-${length}`, dayOfYear.toString())
    return defaultValue;
  }

  try {
    const saved = session.getItem(`wordle-${name}-${length}`);
    if (!saved) return defaultValue;

    return JSON.parse(saved, (key, value) => {
      const result = reviver(key, value);
      if (result === undefined) throw '';
      return result;
    });
  } catch {
    return defaultValue;
  }
}

let gameState = $state(get<GameState>('game-state', 'playing', (_, value) => {
  if (['playing', 'loss', 'win'].includes(value)) return value;
  return undefined;
}));
export const game = {
  get value() { return gameState; },
  set value(value: GameState) {
    gameState = value;
    session.setItem(`wordle-game-state-${length}`, JSON.stringify(gameState));
  },
};

let inputState = $state(get<Letter[]>('input', [], (_, value) => {
  if (typeof value !== 'string') return value;
  if (/^[a-z]$/.test(value)) return value;
  return undefined;
}));
export const input = {
  get chars() { return inputState; },
  get length() { return inputState.length; },
  add(char: Letter) {
    inputState = [...inputState, char];
    session.setItem(`wordle-input-${length}`, JSON.stringify(inputState));
  },
  remove(amount = 1) {
    inputState = inputState.slice(0, -amount);
    session.setItem(`wordle-input-${length}`, JSON.stringify(inputState));
  },
  clear() {
    inputState = [];
    session.setItem(`wordle-input-${length}`, JSON.stringify(inputState));
  },
};

let letterState = $state(get<Partial<Record<Letter, LetterState>>>('letters', {}, (name, value) => {
  if (typeof value !== 'string') return value;
  if (/[a-z]/.test(name) && ['correct', 'present', 'absent'].includes(value)) return value;
  return undefined;
}));
export const letter = {
  get letters() { return letterState; },
  get: (key: string) => letterState[key as Letter],
  set(key: Letter, value: LetterState) {
    letterState[key] = value;
    session.setItem(`wordle-letters-${length}`, JSON.stringify(letterState));
  },
  clear() {
    letterState = {};
    session.setItem(`wordle-letters-${length}`, JSON.stringify(letterState));
  },
};

let guessState = $state(get<{ letter: Letter, state: LetterState; }[][]>('guesses', [], (_, value) => {
  if (!value || Array.isArray(value) || typeof value === 'string') return value;
  if (/^[a-z]$/.test(value.letter) && ['correct', 'present', 'absent'].includes(value.state)) return value;
  return undefined;
}));
export const guess = {
  get all() { return guessState; },
  get: (guess: number) => guessState[guess],
  set(guess: number, value: typeof guessState[number]) {
    guessState[guess] = value;
    session.setItem(`wordle-guesses-${length}`, JSON.stringify(guessState));
  },
  clear() {
    guessState = [];
    session.setItem(`wordle-guesses-${length}`, JSON.stringify(guessState));
  },
};

export {
  input as inputState,
  letter as letterState,
  guess as guessState,
  game as gameState,
};
