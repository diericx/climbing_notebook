<script lang="ts">
  import WidgetTemplate from '$lib/components/WidgetTemplate.svelte';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  const { user } = data;
  $: widgets = data.widgets;
  $: customQueryResults = data.customQueryResults;
  $: shouldApplyFilterMadeByMe = false;
  $: shouldApplyFilterChart = false;
  $: shouldApplyFilterHeatmap = false;

  // Apply filters
  $: {
    widgets = data.widgets;
    if (shouldApplyFilterMadeByMe) {
      widgets = widgets.filter((w) => w.ownerId == user.userId);
    }
    if (shouldApplyFilterChart) {
      widgets = widgets.filter((w) => w.type == 'chart');
    }
    if (shouldApplyFilterHeatmap) {
      widgets = widgets.filter((w) => w.type == 'heatmapCalendar');
    }
  }
</script>

<div class="mb-7">
  <div class="flex flex-wrap justify-between">
    <h1>Community Widgets</h1>

    <button
      class="btn btn-sm variant-ringed mb-1"
      on:click={() =>
        modalStore.trigger({
          type: 'component',
          component: 'formModalWidget',
          meta: {
            action: `/widget?/new`,
            title: 'New Community Widget',
            data: { isTemplate: true },
            formProps: {
              showOrder: false,
              showDescription: true,
              allowedTypes: ['chart', 'heatmapCalendar'],
            },
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
    All charts below are being rendered using your exercise data. If some charts are empty this means
    you don't have any relevant data. Refer to the widget description for more info or click on the widget
    to see how it is made.
  </div>
</div>

<div class="mb-7">
  <div class="mb-4">
    <span
      class="chip {shouldApplyFilterMadeByMe ? 'variant-filled' : 'variant-soft'}"
      on:click={() => {
        shouldApplyFilterMadeByMe = !shouldApplyFilterMadeByMe;
      }}
      on:keypress
    >
      <span>Made By Me</span>
    </span>
    <span
      class="chip {shouldApplyFilterChart ? 'variant-filled' : 'variant-soft'}"
      on:click={() => {
        shouldApplyFilterChart = !shouldApplyFilterChart;
      }}
      on:keypress
    >
      <span>Charts</span>
    </span>
    <span
      class="chip {shouldApplyFilterHeatmap ? 'variant-filled' : 'variant-soft'}"
      on:click={() => {
        shouldApplyFilterHeatmap = !shouldApplyFilterHeatmap;
      }}
      on:keypress
    >
      <span>Heatmaps</span>
    </span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    {#each widgets as widget}
      <div class={widget.width == 'full' ? 'col-span-2' : 'col-span-1'}>
        <WidgetTemplate {user} {widget} {customQueryResults} />
      </div>
    {/each}
  </div>
</div>
