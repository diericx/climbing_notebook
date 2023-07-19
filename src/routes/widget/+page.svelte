<script lang="ts">
  import WidgetTemplate from '$lib/components/WidgetTemplate.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const { user } = data;
  $: widgets = data.widgets;
  $: customQueryResults = data.customQueryResults;
</script>

<div class="mb-7">
  <h1>Community Widgets</h1>
  <div class="text-gray-400">
    All charts below are being rendered using the data on your account. If some charts are empty
    this means you don't have any relevant data. Refer to the widget description for more info or
    click on the widget to see how it is made.
  </div>
</div>

<div class="mb-7">
  <h3 class="text-gray-400">Created by me</h3>
  <hr />
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    {#each widgets as widget}
      <div class={widget.width == 'full' ? 'col-span-2' : 'col-span-1'}>
        <WidgetTemplate {user} {widget} {customQueryResults} />
      </div>
    {/each}
  </div>
</div>

<div>
  <hr />
</div>
