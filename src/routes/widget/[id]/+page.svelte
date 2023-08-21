<script lang="ts">
  import Chart from '$lib/components/Chart.svelte';
  import Dataset from '$lib/components/Dataset.svelte';
  import HeatmapCalendar from '$lib/components/HeatmapCalendar.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import Icon from '@iconify/svelte';
  import { Avatar } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  const { user } = data;
  $: widget = data.widget;
  $: customQueryResults = data.customQueryResults;
  $: datasets = widget.datasets;

  $: isOwner = widget.ownerId == user.userId;
</script>

<div class="flex justify-between">
  <div>
    <h1 class="font-bold">{widget.name}</h1>
  </div>
  <div class="mb-1 flex space-x-2">
    <div>
      <FormButton
        action={`/widget/${widget.id}?/addToMyDashboard&redirectTo=/`}
        class="btn btn-sm variant-filled"
      >
        <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
        <span>Add To My Dashboard</span>
      </FormButton>
    </div>
    {#if isOwner}
      <div>
        <a class="btn btn-sm variant-ringed" href={`/widget/${widget.id}/edit`}>
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span>Edit</span>
        </a>
      </div>
    {/if}
  </div>
</div>

<div class="mt-1 text-gray-600">
  {widget.description}
</div>
<div class="flex mb-8 mt-2 items-center">
  <Avatar
    class="text-white"
    width="w-9"
    initials={widget.owner.username}
    background="bg-primary-500"
  />
  <div class="ml-2 align-middle items-center">
    <div class="text-md leading-none text-gray-600 font-bold">{widget.owner.username}</div>
  </div>
</div>

{#if widget.type == 'chart'}
  <div class="mb-7">
    <div class="card p-4">
      <Chart {datasets} {customQueryResults} />
    </div>
  </div>
{:else if widget.type == 'heatmapCalendar'}
  <div class="mb-7 w-fit">
    <div class="card p-4">
      <HeatmapCalendar {datasets} {customQueryResults} />
    </div>
  </div>
{/if}

{#if widget.type == 'chart' || widget.type == 'heatmapCalendar'}
  <div class="mb-8">
    <div class="flex justify-between">
      <div>
        <h2>Simple Editor Fields</h2>
      </div>
    </div>
    <hr />

    <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
      {#if widget.sets == null && widget.reps == null && widget.weight == null && widget.minutes == null && widget.seconds == null}
        <div class="flex items-center">
          <p class="text-gray-400 inline-block align-middle">No simple editor fields</p>
        </div>
      {/if}
      <p>
        {#if widget.sets != null}
          <b>sets </b>
        {/if}
      </p>
      <p>
        {#if widget.reps != null}
          <b>reps </b>
        {/if}
      </p>
      <p>
        {#if widget.weight != null}
          <b>weight </b>
        {/if}
      </p>
      <p>
        {#if widget.minutes != null}
          <b>minutes </b>
        {/if}
      </p>
      <p>
        {#if widget.seconds != null}
          <b>seconds </b>
        {/if}
      </p>
    </div>
  </div>

  <div class="flex justify-between">
    <div>
      <h2>Datasets</h2>
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
