<script lang="ts">
  import { camelToTitle } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import Chart from '$lib/components/Chart.svelte';
  import Dataset from '$lib/components/Dataset.svelte';

  export let data: PageData;
  const { user } = data;
  $: widget = data.widget;
  $: trainingPrograms = data.trainingPrograms;
  $: customQueryResults = data.customQueryResults;
  $: datasets = widget.datasets;

  $: showButtons = widget.ownerId == user.userId;
</script>

<div class="flex justify-between">
  <div>
    <h1>{widget.name}</h1>
  </div>
  <div class="mb-1">
    {#if showButtons}
      <button
        class="btn btn-sm variant-ringed"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalWidget',
            meta: {
              action: `/widget/${widget.id}?/update`,
              title: 'Edit Widget',
              data: widget,
              showType: false,
              trainingPrograms,
            },
          })}
      >
        <Icon icon="material-symbols:edit-outline" height="18" />
        <span>Edit</span>
      </button>
    {/if}
    {#if !widget.isTemplate}
      <button
        class="btn btn-sm variant-filled mb-1"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalWidgetTemplate',
            meta: {
              action: `/widget/${widget.id}?/newTemplate&redirectTo=/widget`,
              title: 'New Community Widget Template',
            },
          })}
      >
        <Icon icon="material-symbols:share" height="18" />
        <span>Share Widget</span>
      </button>
    {/if}
  </div>
</div>
<hr />

{#if !widget.isTemplate}
  <div class="mb-7">
    <p><b>Width:</b> {widget.width}</p>
    <p><b>Order:</b> {widget.order}</p>
    <p><b>Type:</b> {camelToTitle(widget.type)}</p>
    {#if widget.type == 'dailyExerciseCalendar'}
      <p><b>Training Program:</b> {widget.trainingProgram?.name || 'Active Training Program'}</p>
    {/if}
  </div>
{/if}

{#if widget.type == 'chart'}
  <div class="mb-7">
    <h1>Chart Preview</h1>
    <hr />
    <Chart {datasets} {customQueryResults} />
  </div>
{/if}

{#if widget.type == 'chart' || widget.type == 'heatmapCalendar'}
  <div class="flex justify-between">
    <div>
      <h2>Datasets</h2>
    </div>
    <div>
      {#if showButtons}
        <button
          class="btn btn-sm variant-filled mb-1"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalDataset',
              meta: {
                action: `/widget/${widget.id}/dataset?/new`,
                title: 'Add Dataset',
                showType: widget.type != 'heatmapCalendar',
                showColor: widget.type != 'heatmapCalendar',
                showEquation: widget.type != 'heatmapCalendar',
              },
            })}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>Add Dataset</span>
        </button>
      {/if}
    </div>
  </div>
  <hr />

  {#if widget.datasets.length == 0}
    <p class="text-gray-400 italic">No Datasets</p>
  {:else}
    {#each widget.datasets as dataset}
      <Dataset showButtons={false} {widget} {dataset} />
    {/each}
  {/if}
{/if}
