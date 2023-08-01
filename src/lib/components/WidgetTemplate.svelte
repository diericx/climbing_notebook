<!-- This component does not support calendar or daily exercises -->

<script lang="ts">
  import { enhance } from '$app/forms';
  import type { CustomQueryResults } from '$lib/customQuery';
  import type { WidgetComplete } from '$lib/prisma';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import Chart from './Chart.svelte';
  import HeatmapCalendar from './HeatmapCalendar.svelte';

  export let widget: WidgetComplete;
  export let customQueryResults: CustomQueryResults[];
  export let user: any;
</script>

<div class="block card card-hover p-4">
  <a style="height: 100%;" class="flex flex-col justify-between" href={`/widget/${widget.id}`}>
    <div class="w-full flex mb-1">
      <div class="flex-1">
        <div class="font-bold text-xl">
          {widget.name}
        </div>
      </div>
      {#if widget.owner.id == user.userId}
        <div>
          <a class="btn btn-sm variant-ringed mr-2" href={`/widget/${widget.id}/edit`}>
            <Icon icon="material-symbols:edit-outline" height="18" />
            <span>Edit</span>
          </a>
        </div>
        <form method="POST" action={`/widget/${widget.id}?/delete`} use:enhance>
          <input type="hidden" name="id" value={widget.id} />
          <button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
            <Icon icon="mdi:trash-outline" height="18" />
            Delete
          </button>
        </form>
      {/if}
    </div>
    <div class="mb-2">
      <div class="">
        {widget.description}
        <br />
      </div>
    </div>
    {#if widget.type == 'chart'}
      {#if widget.datasets.length == 0}
        <p class="text-gray-400 italic">
          Widget is not fully configured yet. Edit the widget to finish configuration.
        </p>
      {:else}
        <Chart datasets={widget.datasets} {customQueryResults} />
      {/if}
    {:else if widget.type == 'heatmapCalendar'}
      <div>
        <HeatmapCalendar datasets={widget.datasets} {customQueryResults} />
      </div>
    {/if}

    <div class="mt-4 flex justify-between">
      <div class="text-gray-400">
        by <b>{widget.owner.username}</b>
      </div>
      <div class="text-gray-400">Used <b>{widget.useCount} times</b></div>
    </div>
  </a>
</div>
