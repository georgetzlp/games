<script>
  import { browser } from '$app/environment';
  import './styles.css';

  if (browser) {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const root = document.documentElement;

    if (media.matches) root.classList.toggle('dark');
    media.addEventListener('change', (event) => root.classList.toggle('dark', event.matches));
  }
</script>

<div class="app">
  <main>
    <slot />
  </main>
</div>

<style lang="scss">
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
