<script lang="ts" context="module">
  import { writable } from 'svelte/store';

  const charStore = writable<string[]>([]);

  export const addChar = (char: string) => charStore.update(chars => [...chars, char]);
  export const removeChar = () => charStore.update(chars => chars.slice(0, -1));
  export const clearChars = () => charStore.set([]);
</script>

<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition';
  import { linear } from 'svelte/easing';
  import { browser } from '$app/environment';
  import type { LetterParams } from './types';

  export let word: string;
  export let totalAttempts = word.length + 1;

  let currentAttempt = 0;
  let guesses: string[][] = Array(totalAttempts).fill([]);

  function checkWord(guess: string) {
    const array: LetterParams['type'][] = [];

    let wordCheck = word;
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]!;
      let result: LetterParams['type'] = 'present';

      if (!wordCheck.includes(letter)) result = 'absent';
      if (wordCheck.indexOf(letter) === i) result = 'correct';
      wordCheck = wordCheck.replace(letter, '#');

      array.push(result);
    }

    return array;
  }

  if (browser) document.addEventListener('keydown', ({ key, ctrlKey }) => {
    if (/^[a-zA-Z]$/.test(key) && $charStore.length < word.length) return addChar(key);

    if (key === 'Enter') {
      if ($charStore.length !== word.length) return;
      guesses[currentAttempt++] = $charStore;
      clearChars();
    }

    if (key === 'Backspace') {
      if (ctrlKey) clearChars();
      return removeChar()
    }
  });

  function flip(_: HTMLElement, { duration, i }: { duration: number; i: number }): TransitionConfig {
    return {
      duration,
      delay: i * 150,
      css: (t) => {
        const eased = linear(t);

        return `
          scale: ${eased} 1;
        `
      }
    }
  }
</script>

{#snippet letter({ letter, type, i }: LetterParams)}
  <button
    class="letter {type}"
    in:flip={{ duration: 300, i }}
    on:click={() => {
      if (!letter || $charStore.length >= word.length) return;

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
          {@render letter({ letter: character, type: result[i]!, i })}
        {/each}
      {:else if currentAttempt < line}
        {#each { length: word.length } as _, i}
          {@render letter({ letter: '', type: 'inactive', i })}
        {/each}
      {:else}
        {#each { length: word.length } as _, i}
          {@render letter({ letter: $charStore[i] ?? '', type: 'active', i })}
        {/each}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
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
      --_color-border: hsl(0, 0%, 45%);
    }

    &.correct {
      --_color-bg: hsl(120, 60%, 42%);
    }
    &.present {
      --_color-bg: hsl(43, 95%, 52%);
    }
    &.absent {
      --_color-bg: hsl(0, 0%, 50%);
      --_color-fg: hsl(0, 0%, 13%);
    }
  }
</style>
