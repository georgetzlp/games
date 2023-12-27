<script>
  import Board from "$lib/components/worldle/Board.svelte";

</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="The game worldle written in Svelte" />
</svelte:head>

<section aria-label="Game">
  <h1>Worldle Clone written in <strong>Svelte</strong></h1>
  <Board word="amogus" />
</section>

<style>
  section {
    display: grid;
    justify-items: center;
  }
</style>
