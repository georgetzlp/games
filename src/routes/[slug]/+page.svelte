<script lang="ts">
  import Page from '../+page.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Page {data} />
