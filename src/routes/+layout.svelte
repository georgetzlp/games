<script>
  import './styles.css';
</script>

<div class="app">
  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin-inline: auto;
    width: min(100%, 60em);
  }
</style>
