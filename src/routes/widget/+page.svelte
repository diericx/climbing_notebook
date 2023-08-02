<script lang="ts">
  import WidgetTemplate from '$lib/components/WidgetTemplate.svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import Icon from '@iconify/svelte';

  export let data: PageData;
  const { user } = data;
  $: widgets = data.widgets;
  $: customQueryResults = data.customQueryResults;
</script>

<div class="mb-7">
  <div class="flex justify-between">
    <h1>Community Widgets</h1>

    <button
      class="btn btn-sm variant-ringed mb-1"
      on:click={() =>
        modalStore.trigger({
          type: 'component',
          component: 'formModalWidget',
          meta: {
            data: { isTemplate: true },
            action: `/widget?/new`,
            title: 'New Community Widget',
            showOrder: false,
            showDescription: true,
            allowedTypes: ['chart', 'heatmapCalendar'],
          },
        })}
    >
      <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
      <span>New Community Widget</span>
    </button>
  </div>
  <div class="text-gray-400">
    Find charts made by the community and add them to your dashboard!
    <br />
    <br />
    All charts below are being rendered using the data on your account. If some charts are empty this
    means you don't have any relevant data. Refer to the widget description for more info or click on
    the widget to see how it is made.
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
