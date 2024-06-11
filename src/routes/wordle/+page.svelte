<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  import Board from './components/Board.svelte';
  import Keyboard from './components/Keyboard.svelte';
  import { gameState } from './components/states.svelte';

  const { data } = $props();
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="The game wordle written in Svelte" />
</svelte:head>

<section aria-label="Game">
  <h1>Wordle Clone written in <strong>Svelte</strong></h1>
  <Board word={data.word} validWords={data.validWords} />

  <Keyboard />
  <Modal title="GG!" open={gameState.value === 'win'}>
    <p>You won!</p>
  </Modal>
  <Modal title="Better luck next time!" open={gameState.value === 'loss'}>
    <p>You lost. The word was <strong>{data.word}</strong></p>
  </Modal>
</section>

<style lang="scss">
  :root {
    --color-correct: hsl(120, 60%, 42%);
    --color-present: hsl(43, 95%, 52%);
    --color-absent: hsl(0, 0%, 64%);

    --color-inactive: hsl(0, 0%, 78%);

    &.dark {
      --color-correct: hsl(120, 60%, 42%);
      --color-present: hsl(43, 95%, 52%);
      --color-absent: hsl(0, 0%, 35%);

      --color-inactive: hsl(0, 0%, 45%);
    }
  }

  section {
    display: grid;
    grid-template-rows: auto 1fr auto;
    justify-items: center;
    gap: 1rem;
    flex-grow: 1;

    > :global(.board) {
      padding: var(--_gap);
      padding-inline-end: calc(var(--_gap) * 2);
      padding-block-end: calc(var(--_gap) * 2);
      max-width: clamp(
        calc(var(--_letter-size) * 5),
        calc((var(--_letter-size) + var(--_gap)) * 12 + var(--_letter-size) * 0.5),
        80%,
      );

      max-height: 60dvh;
      overflow: auto;
      scroll-snap-type: both proximity;

      > :global(.letter) {
        scroll-snap-align: start;
      }
    }

    > :global(.keyboard) {
      width: 100%;
    }
  }
</style>
