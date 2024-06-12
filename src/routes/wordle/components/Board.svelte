<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition';
  import { linear } from 'svelte/easing';
  import { dev } from '$app/environment';
  import type { LetterState, GameState, Letter } from './types';
  import { inputState, letterState, guessState, gameState } from './states.svelte';

  const {
    word,
    validWords,
    totalAttempts = word.length + 1,
    onStateChange = () => {},
  }: {
    word: string,
    validWords?: string[],
    readonly totalAttempts?: number,
    onStateChange?: (state: GameState) => void,
  } = $props();

  let currentAttempt = $state(guessState.all.length);
  let attempts = new Array<HTMLDivElement>(totalAttempts);

  $effect(() => {
    if (currentAttempt >= totalAttempts && gameState.value === 'playing') stop('loss');
  });

  function checkWord(guess: string) {
    const array: LetterState[] = Array(guess.length);

    if (guess === word) {
      stop('win');
      return array.fill('correct');
    }

    let wordCheck = word;
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i] as Letter;
      let result: LetterState = 'present';

      if (!wordCheck.includes(letter)) result = 'absent';
      if (result === 'present' && wordCheck.indexOf(letter) === i) result = 'correct';
      wordCheck = wordCheck.replace(letter, '#');

      array[i] = result;
      if (!letterState.get(letter)) letterState.set(letter, result);
    }

    return array;
  }

  const keyboardListener = ({ key, ctrlKey }: KeyboardEvent): any => {
    if (/^[a-z]$/i.test(key) && !ctrlKey && inputState.length < word.length) return inputState.add(key.toLowerCase() as Letter);

    if (key === 'Enter') {
      if (inputState.length !== word.length) return;
      const string = inputState.chars.join('');

      if (!validWords?.includes(string) && validWords !== undefined) return console.log('invalid word', string);

      const result = checkWord(string);
      const letterStates = inputState.chars.map((letter, index) => ({ letter, state: result[index]! }));

      guessState.set(currentAttempt++, letterStates);
      inputState.clear();
    }

    if (key === 'Backspace') {
      if (ctrlKey) inputState.clear();
      else inputState.remove();
    }
  }

  $effect(() => {
    document.addEventListener('keydown', keyboardListener);
    attempts[currentAttempt]?.scrollIntoView({ inline: 'start', block: 'center' });

    return () => document.removeEventListener('keydown', keyboardListener);
  });

  function stop(state: GameState) {
    if (dev) console.log(state);
    document.removeEventListener('keydown', keyboardListener);
    gameState.value = state;
    onStateChange(state);
  }

  interface LetterParams {
    letter?: Letter | undefined,
    type: LetterState | 'active' | 'inactive',
    position: number,
  }

  export function flip(_: HTMLElement, { duration, delay }: { duration: number, delay: number }): TransitionConfig {
    return {
      duration,
      delay,
      css(t) {
        const eased = linear(t);

        return `scale: ${eased} 1;`;
      },
    };
  }

  const revealDelay = 150;
</script>

{#snippet letter({ letter, type, position }: LetterParams)}
  {@const blankFunction = () => ({})}
  {@const animation = type !== 'active' ? flip : blankFunction}
  <button
    class="letter {type}"
    in:animation|global={{ duration: 300, delay: position * revealDelay }}
    onintrostart={(e) => {
      if (animation !== blankFunction) e.currentTarget.classList.add('hidden');
      setTimeout(() => {
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, position * revealDelay - revealDelay * 1.5);
    }}
    onintroend={(e) => e.currentTarget.classList.remove('hidden')}
    onclick={() => {
      if (!letter || inputState.length >= word.length) return;

      inputState.add(letter);
    }}
  >
    {letter ?? ''}
  </button>
{/snippet}

<div class="board" style="--attempts: {totalAttempts}; --letters: {word.length};">
  {#each { length: totalAttempts } as _, line}
    {@const guess = guessState.get(line)!}
    <div class="attempt" bind:this={attempts[line]}>
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
    appearance: none;
    display: grid;
    place-items: center;
    height: var(--_letter-size);
    aspect-ratio: 1;
    padding: 0;
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
    &.hidden {
      scale: 0 1;
    }
  }
</style>
