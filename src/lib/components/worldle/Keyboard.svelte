<script lang="ts">
  import { browser } from '$app/environment';
  import { clearChars, stateStore } from './Board.svelte';
  import type { Key, KeyWithoutString } from './types';

  export let lines: Key[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      { key:
        'Enter',
        size: 1.5,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 56c0-13.3 10.7-24 24-24s24 10.7 24 24v168c0 48.6-39.4 88-88 88H81.9l87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 305c-9.4-9.4-9.4-24.6 0-33.9L135 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87H424c22.1 0 40-17.9 40-40V56z"/></svg>'
      }
    ],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm',
      {
        key: 'Backspace',
        size: 1.5,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H205.3zM528 128v256c0 8.8-7.2 16-16 16H205.3c-4.2 0-8.3-1.7-11.3-4.7L54.6 256l139.3-139.3c3-3 7.1-4.7 11.3-4.7H512c8.8 0 16 7.2 16 16zm-95 47c-9.4-9.4-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9z"/></svg>'
      },
      {
        icon:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M378.4 71.4c8.5-10.1 7.2-25.3-2.9-33.8s-25.3-7.2-33.8 2.9L192 218.7 42.4 40.6C33.9 30.4 18.7 29.1 8.6 37.6S-2.9 61.3 5.6 71.4L160.7 256 5.6 440.6c-8.5 10.2-7.2 25.3 2.9 33.8s25.3 7.2 33.8-2.9L192 293.3 341.6 471.4c8.5 10.1 23.7 11.5 33.8 2.9s11.5-23.7 2.9-33.8L223.3 256l155-184.6z"/></svg>',
        action: clearChars
      },
    ],
  ];
  export let simulationElement: Document | HTMLElement | HTMLElement[] = browser ? document : [];

  function simulateKeyPress(key: string) {
    const event = new KeyboardEvent('keydown', {
      key,
    });

    if (Array.isArray(simulationElement)) simulationElement.forEach(el => el.dispatchEvent(event));
    else simulationElement.dispatchEvent(event);
  }
</script>

<div class="keyboard">
  {#each lines as line}
    <div class="line">
      {#each line as key}
      {#if typeof key === 'string'}
        <button
          class="key {$stateStore[key]}"
          on:click={() => simulateKeyPress(key as string)}
        >
          {key}
        </button>
      {:else}
        {@const meta = key as KeyWithoutString}
        <button
          class="key"
          style={'size' in meta ? `--size: ${meta.size}` : undefined}
          on:click={() => 'action' in meta ? meta.action() : simulateKeyPress(meta.key)}
        >
          {#if 'icon' in meta}
            {@html meta.icon}
          {:else}
            {meta.key}
          {/if}
        </button>
      {/if}
      {/each}
    </div>
  {/each}
</div>

<style lang="scss">
  .keyboard {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .line {
    display: flex;
    justify-content: center;
    gap: inherit;
  }

  button {
    all: unset;
    display: grid;
    place-content: center;
    height: 2em;
    aspect-ratio: var(--size, 1) / 1;
    font-size: 2em;
    text-transform: uppercase;
    border-radius: 0.25em;

    user-select: none;
    cursor: pointer;

    background-color: var(--_color, var(--color-inactive));

    &.correct {
      --_color: var(--color-correct);
    }
    &.present {
      --_color: var(--color-present);
    }
    &.absent {
      --_color: var(--color-absent);
    }
  }

  .keyboard :global(:where(svg)) {
    object-fit: contain;
    color: currentColor;
    stroke: currentColor;
    fill: currentColor;
    width: calc(var(--size, 1) * 1em - 0.5em);
  }
</style>
