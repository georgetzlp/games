<script lang="ts" context="module">
  import { writable, type Readable } from 'svelte/store';

  const inputStore = writable<string[]>([]);
  export const addChar = (char: string) => inputStore.update(chars => [...chars, char]);
  export const removeChar = () => inputStore.update(chars => chars.slice(0, -1));
  export const clearChars = () => inputStore.set([]);

  export type StateStore = Record<string, LetterParams['type']>;
  const writableState = writable<StateStore>({});
  export const stateStore: Readable<StateStore> = { subscribe: writableState.subscribe };
  export const setState = (key: string, value: LetterParams['type']) => writableState.update(state => ({ ...state, [key]: value }));
  export const clearState = () => writableState.set({});
</script>

<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { linear } from 'svelte/easing';
  import { browser } from '$app/environment';
  import type { LetterParams } from './types';

  export let word: string;
  export let totalAttempts = word.length + 1;

  let currentAttempt = 0;
  let guesses: string[][] = Array(totalAttempts).fill([]);

  const dispatcher = createEventDispatcher();

  $: currentAttempt >= totalAttempts && stop('You ran out of attempts, better luck tomorrow!');

  function checkWord(guess: string) {
    const array: LetterParams['type'][] = Array(guess.length);

    if (guess === word) {
      stop('You won!');
      return array.fill('correct');
    }

    let wordCheck = word;
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]!;
      let result: LetterParams['type'] = 'present';

      if (!wordCheck.includes(letter)) result = 'absent';
      if (wordCheck.indexOf(letter) === i) result = 'correct';
      wordCheck = wordCheck.replace(letter, '#');

      array[i] = result;
      if (!(letter in $stateStore)) setState(letter, result);
    }

    return array;
  }

  const keyboardListener = ({ key, ctrlKey }: KeyboardEvent) => {
    if (/^[a-zA-Z]$/.test(key) && $inputStore.length < word.length) return addChar(key);

    if (key === 'Enter') {
      if ($inputStore.length !== word.length) return;
      guesses[currentAttempt++] = $inputStore;
      clearChars();
    }

    if (key === 'Backspace') {
      if (ctrlKey) clearChars();
      return removeChar()
    }
  }

  function stop(message = 'You lost :(') {
    document.removeEventListener('keydown', keyboardListener);
    clearState();

    dispatcher('stop', {
      word,
      message,
    });
  }

  if (browser) document.addEventListener('keydown', keyboardListener);

  function flip(_: HTMLElement, { duration, i }: { duration: number; i: number }): TransitionConfig {
    return {
      duration,
      delay: i * 150,
      css: (t) => {
        const eased = linear(t);

        return `scale: ${eased} 1;`;
      }
    }
  }
</script>

{#snippet letter({ letter, type, position }: LetterParams)}
  <button
    class="letter {type}"
    in:flip={{ duration: 300, i: position }}
    on:click={() => {
      if (!letter || $inputStore.length >= word.length) return;

      addChar(letter);
    }}
  >
    {letter}
  </button>
{/snippet}

<div class="board-wrapper" style="--attempts: {totalAttempts}; --letters: {word.length};">
  {#each guesses as guess, line}
    {@const result = checkWord(guess.join(''))}
    <div class="attempt">
      {#if currentAttempt > line}
        {#each guess as character, i}
          {@render letter({ letter: character, type: result[i]!, position: i })}
        {/each}
      {:else if currentAttempt < line}
        {#each { length: word.length } as _, i}
          {@render letter({ letter: '', type: 'inactive', position: i })}
        {/each}
      {:else}
        {#each { length: word.length } as _, i}
          {@render letter({ letter: $inputStore[i] ?? '', type: 'active', position: i })}
        {/each}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  :global(:where(:root)) {
    --color-correct: hsl(120, 60%, 42%);
    --color-present: hsl(43, 95%, 52%);
    --color-absent: hsl(0, 0%, 35%);

    --color-inactive: hsl(0, 0%, 45%);
  }

  .board-wrapper {
    --_letter-size: 4rem;

    display: grid;
    grid-template-rows: repeat(var(--attempts), var(--_letter-size));
    gap: 0.25rem;
  }

  .attempt {
    display: grid;
    grid-template-columns: repeat(var(--letters), var(--_letter-size));
    gap: inherit;
  }

  .letter {
    display: grid;
    place-items: center;
    height: var(--_letter-size);
    aspect-ratio: 1;
    border-radius: 0.125em;
    border-style: solid;
    border-width: 0.125em;

    font-size: calc(var(--_letter-size) - 1.5em);
    font-weight: bold;
    text-transform: uppercase;
    line-height: 0;

    color: var(--_color-fg, hsl(0, 0%, 100%));
    background-color: var(--_color-bg, transparent);
    border-color: var(--_color-border, var(--_color-bg));

    &.active {
      --_color-fg: hsl(0, 0%, 80%);
      --_color-border: hsl(0, 0%, 62%);
    }
    &.inactive {
      --_color-border: var(--color-inactive);
    }

    &.correct {
      --_color-bg: var(--color-correct);
    }
    &.present {
      --_color-bg: var(--color-present);
    }
    &.absent {
      --_color-bg: var(--color-absent);
    }
  }
</style>
