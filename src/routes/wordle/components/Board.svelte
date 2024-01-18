<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { browser, dev } from '$app/environment';
  import type { LetterState, StopState } from './types';
  import { flip } from './flip';
  import { inputState, letterState, guessState } from './states.svelte';

  const dispatcher = createEventDispatcher<{ stop: StopState }>();

  export let word: string;
  export let totalAttempts = word.length + 1;

  let currentAttempt = 0;

  $: currentAttempt >= totalAttempts && stop('loss');

  function checkWord(guess: string) {
    const array: LetterState[] = Array(guess.length);

    if (guess === word) {
      stop('win');
      return array.fill('correct');
    }

    let wordCheck = word;
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]!;
      let result: LetterState = 'present';

      if (!wordCheck.includes(letter)) result = 'absent';
      if (wordCheck.indexOf(letter) === i) result = 'correct';
      wordCheck = wordCheck.replace(letter, '#');

      array[i] = result;
      if (letterState.get(letter) !== 'correct') {
        letterState.set(letter, result);
        console.log(letter, result);
      }
    }

    return array;
  }

  const keyboardListener = ({ key, ctrlKey }: KeyboardEvent): any => {
    if (/^[a-zA-Z]$/.test(key) && inputState.length < word.length) return inputState.add(key as Letter);

    if (key === 'Enter') {
      if (inputState.length !== word.length) return;

      const result = checkWord(inputState.chars.join(''));
      const letterStates = inputState.chars.map((letter, index) => ({ letter, state: result[index]! }));

      guessState.set(currentAttempt++, letterStates);
      inputState.clear();
    }

    if (key === 'Backspace') {
      if (ctrlKey) inputState.clear();
      else inputState.remove();
    }
  }

  if (browser) document.addEventListener('keydown', keyboardListener);

  function stop(state: StopState) {
    if (dev) console.log(state);
    document.removeEventListener('keydown', keyboardListener);
    dispatcher('stop', state);
  }

  type LetterParams = {
    letter?: Letter | undefined,
    type: LetterState | 'active' | 'inactive',
    position: number,
  };
</script>

{#snippet letter({ letter, type, position }: LetterParams)}
  <!-- hacky fix but it works -->
  {@const animation = type !== 'active' ? flip : () => ({})}
  <button
    class="letter {type}"
    in:animation|global={{ duration: 300, i: position }}
    on:click={() => {
      if (!letter || inputState.length >= word.length) return;

      inputState.add(letter);
    }}
  >
    {letter ?? ''}
  </button>
{/snippet}

<div class="board" style="--attempts: {totalAttempts}; --letters: {word.length};">
  {#each { length: totalAttempts } as _, line}
    {@const guess = guessState.get(line) ?? []}
    <div class="attempt">
      {#if currentAttempt > line}
        {#each guess as data, i}
          {@render letter({ letter: data.letter, type: data.state, position: i })}
        {/each}
      {:else if currentAttempt < line}
        {#each { length: word.length } as _, i}
          {@render letter({ type: 'inactive', position: i })}
        {/each}
      {:else}
        {#each { length: word.length } as _, i}
          {@render letter({ letter: inputState.chars[i], type: 'active', position: i })}
        {/each}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  .board {
    --_letter-size: 4rem;
    --_gap: 0.25rem;

    display: grid;
    grid-template-rows: repeat(var(--attempts), var(--_letter-size));
    gap: var(--_gap);
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
      --_color-border: hsl(0, 0%, 62%);
      --_color-fg: var(--_color-border);

      :global(.dark) & {
        --_color-fg: hsl(0, 0%, 80%);
      }
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
