<script lang="ts">
  import Widget from '$lib/components/Widget.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: widgets = data.widgets;
  $: customQueryResults = data.customQueryResults;
</script>

<div class="mb-7">
  <h1>Community Widgets</h1>
</div>

<div class="mb-7">
  <h3 class="text-gray-400">Created by me</h3>
  <hr />
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    {#each widgets as widget}
      <div class={widget.width == 'full' ? 'col-span-2' : 'col-span-1'}>
        <Widget {widget} {customQueryResults} />
      </div>
    {/each}
  </div>
</div>

<div>
  <hr />
</div>
