<!-- This component does not support calendar or daily exercises -->

<script lang="ts">
  import { enhance } from '$app/forms';
  import type { CustomQueryResults } from '$lib/customQuery';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import Chart from './Chart.svelte';
  import HeatmapCalendar from './HeatmapCalendar.svelte';
  import { Avatar, popup } from '@skeletonlabs/skeleton';
  import type { Prisma } from '@prisma/client';

  type Widget = Prisma.WidgetGetPayload<{
    include: {
      owner: true;
      datasets: {
        include: {
          customQueries: {
            include: {
              conditions: true;
            };
          };
        };
      };
    };
  }>;

  export let widget: Widget;
  export let customQueryResults: CustomQueryResults[];
  export let user: any;
</script>

<div class="block card card-hover p-4 h-[29rem]">
  <a style="height: 100%;" class="flex flex-col justify-between" href={`/widget/${widget.id}`}>
    <div class="w-full mb-1">
      <div class="h-24">
        <div class="w-full flex">
          <div class="flex-1">
            <div class="font-bold text-xl">
              {widget.name}
            </div>
            {#if widget.isPublished == false}
              <div class="font-bold text-red-300">Not published yet</div>
            {/if}
          </div>

          <button
            class={`btn !bg-transparent justify-between ${
              widget.owner.id == user.userId ? '' : 'hidden'
            }`}
            use:popup={{
              event: 'focus-click',
              target: widget.id,
              placement: 'bottom-end',
            }}
            on:click={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Icon icon="fe:elipsis-h" height="18" />
          </button>

          {#if widget.ownerId != user.userId}
            <form method="POST" action={`/widget/${widget.id}?/addToMyDashboard&redirectTo=/`}>
              <button
                class="btn btn-sm variant-filled"
                value="Set Active"
                on:click={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
                <span>Add To My Dashboard</span>
              </button>
            </form>
          {/if}
        </div>
        <div class="mb-2">
          <div class="text-gray-600 line-clamp-2">
            {widget.description || ''}
            <br />
          </div>
        </div>
      </div>
      <hr class="border-gray-200 divider my-4 mb-2" />
    </div>
    <div>
      {#if widget.type == 'chart'}
        {#if widget.datasets.length == 0}
          <p class="text-gray-400 italic">
            Widget is not fully configured yet. Edit the widget to finish configuration.
          </p>
        {:else}
          <Chart datasets={widget.datasets} {customQueryResults} />
        {/if}
      {:else if widget.type == 'heatmapCalendar'}
        <div class="">
          <HeatmapCalendar datasets={widget.datasets} {customQueryResults} />
        </div>
      {/if}
    </div>

    <div>
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
    </div>
  </a>
</div>

<div class="card shadow-xl py-2 z-50" data-popup={widget.id}>
  <nav class="list-nav">
    <ul>
      <li>
        <div>
          <a class="btn btn-sm flex justify-start" href={`/widget/${widget.id}/edit`}>
            <Icon icon="material-symbols:edit-outline" height="18" />
            <span>Edit</span>
          </a>
        </div>
      </li>
      <li>
        {#if widget.isPublished}
          <form method="POST" action={`/widget/${widget.id}?/hide`} use:enhance>
            <button class="btn btn-sm">
              <Icon icon="mdi:hide-outline" height="18" />
              <span> Hide </span>
            </button>
          </form>
        {:else}
          <form method="POST" action={`/widget/${widget.id}?/publish`} use:enhance>
            <button class="btn btn-sm">
              <Icon icon="majesticons:share-line" height="18" />
              <span> Publish </span>
            </button>
          </form>
        {/if}
      </li>
      <li>
        <form method="POST" action={`/widget/${widget.id}?/delete`} use:enhance>
          <input type="hidden" name="id" value={widget.id} />
          <button class="btn btn-sm" on:click={confirmDelete}>
            <Icon icon="mdi:trash-outline" height="18" />
            <span> Delete </span>
          </button>
        </form>
      </li>
    </ul>
  </nav>
  <div class="arrow bg-surface-100-800-token" />
</div>
