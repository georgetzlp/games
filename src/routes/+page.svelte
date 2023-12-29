<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import Board from '$lib/components/wordle/Board.svelte';
  import Keyboard from '$lib/components/wordle/Keyboard.svelte';

  let modalOpen = false;
  let modalContent: string;

  async function getWord(length: number) {
    const word = await fetch(`/api/get-word/${length}`).then(res => res.text());
    return word;
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="The game wordle written in Svelte" />
</svelte:head>

<section aria-label="Game">
  <h1>Wordle Clone written in <strong>Svelte</strong></h1>
  {#await getWord(5)}
    <p>Getting word...</p>
  {:then word}
    <Board {word} on:stop={({ detail }) => {
      modalContent = detail.message;
      modalOpen = true;
    }} />
  {/await}
  <Keyboard />
  <Modal bind:open={modalOpen} bind:content={modalContent} />
</section>

<style lang="scss">
  section {
    display: grid;
    grid-template-rows: auto 1fr auto;
    justify-items: center;
    flex-grow: 1;
  }
</style>
