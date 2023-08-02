<!-- This component does not support calendar or daily exercises -->

<script lang="ts">
  import { enhance } from '$app/forms';
  import type { CustomQueryResults } from '$lib/customQuery';
  import type { WidgetComplete } from '$lib/prisma';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import Chart from './Chart.svelte';
  import HeatmapCalendar from './HeatmapCalendar.svelte';
  import { Avatar } from '@skeletonlabs/skeleton';

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
        {#if widget.isPublished == false}
          <div class="font-bold text-red-300">Not published yet</div>
        {/if}
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
      <div class="text-gray-600">
        {widget.description || ''}
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

    <hr class="border-gray-200 divider my-4 mb-2" />

    <div class="flex justify-between">
      <div class="text-gray-600 flex items-center">
        <Avatar
          class="text-white"
          width="w-9"
          initials={widget.owner.username}
          background="bg-primary-500"
        />
        <div class="ml-2 align-middle items-center">
          <div class="text-md leading-none font-bold">{widget.owner.username}</div>
        </div>
      </div>
      <div class="text-gray-600 flex items-center">
        <p>
          Used <b>{widget.useCount} times</b>
        </p>
      </div>
    </div>
  </a>
</div>
