<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import Board from '$lib/components/wordle/Board.svelte';
  import Keyboard from '$lib/components/wordle/Keyboard.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let modalOpen = false;
  let modalContent: string;
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="The game wordle written in Svelte" />
</svelte:head>

<section aria-label="Game">
  <h1>Wordle Clone written in <strong>Svelte</strong></h1>
  <Board word={data['word']} on:stop={({ detail }) => {
    modalContent = detail.message + ' The word was ' + detail.word;
    modalOpen = true;
  }} />
  <Keyboard />
  <Modal bind:open={modalOpen} bind:content={modalContent} />
</section>

<style lang="scss">
  section {
    display: grid;
    grid-template-rows: auto 1fr auto;
    justify-items: center;
    gap: 1rem;
    flex-grow: 1;
  }

  :global(.board) {
    padding: var(--_gap);
    padding-inline-end: calc(var(--_gap) * 2);
    max-width: clamp(
      calc(var(--_letter-size) * 5),
      calc((var(--_letter-size) + var(--_gap)) * 12 + var(--_letter-size) * 0.5),
      80%
    );

    max-height: 60dvh;
    overflow: auto;
    scroll-snap-type: both proximity;

    :global(.letter) {
      scroll-snap-align: start;
    }
  }
</style>
