<script lang="ts">
  import type { HTMLDialogAttributes } from 'svelte/elements';
  import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';

  let {
    open = $bindable(false),
    children = blank,
    ...rest
  }: HTMLDialogAttributes = $props();

  let dialog: HTMLDialogElement;
  let button: HTMLButtonElement;

  $effect(() => {
    if (open) {
      dialog.showModal();
      // hack because for some reason the button automatically gets pressed whenever you submit the last word and it auto focuses the dialog hatred
      setTimeout(() => button.disabled = false, 10);
    } else {
      dialog.close();
      button.disabled = true;
    }
  });
</script>

{#snippet blank()}{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  {...rest}
  bind:this={dialog}
  onclick={(e) => e.target === dialog && (open = false)}
>
  <header>
    {#if rest.title}
      <h2 id="{rest.title}-title">{rest.title}</h2>
    {/if}
    <button
      class="close"
      disabled
      bind:this={button}
      onclick={() => open = false}
    >
      <MaterialSymbolsCloseRounded aria-hidden="true" />
      Close
    </button>
  </header>
  <div class="content-wrapper">
    {@render children()}
  </div>
</dialog>

<style lang="scss">
  dialog {
    --_padding: 1rem;
    border: none;
    padding: 0;
    inset: 2rem;
    min-width: 30%;
    // min-height: 30%;
  }

  header {
    display: flex;
    justify-content: space-between;
    padding: var(--_padding) var(--_padding) 0;
  }

  h2 {
    margin: 0;
  }

  .close {
    all: unset;
    appearance: none;
    font-size: 0;
    margin-inline-start: auto;
    cursor: pointer;

    > :global(svg) {
      font-size: 1.2rem;
      margin: auto;
    }
  }

  .content-wrapper {
    padding: var(--_padding);
  }
</style>
