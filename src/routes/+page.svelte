<script>
  import Board from '$lib/components/worldle/Board.svelte';
  import Keyboard from '$lib/components/worldle/Keyboard.svelte';

</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="The game worldle written in Svelte" />
</svelte:head>

<section aria-label="Game">
  <h1>Worldle Clone written in <strong>Svelte</strong></h1>
  <Board word="amogus" />
  <Keyboard />
</section>

<style lang="scss">
  section {
    display: grid;
    grid-template-rows: auto 1fr auto;
    justify-items: center;
    flex-grow: 1;
  }
</style>
