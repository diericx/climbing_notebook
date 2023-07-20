<script lang="ts">
  import { enhance } from '$app/forms';
  import type { DatasetComplete } from '$lib/prisma';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import CustomQuery from './CustomQuery.svelte';
  import type { Widget } from '@prisma/client';

  export let dataset: DatasetComplete;
  export let widget: Widget;

  let className: string = '';
  export { className as class };
  export let showButtons = true;
</script>

<div class={`rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white ${className}`}>
  <div class="flex items-center mb-1">
    <div class="flex w-full items-center justify-between">
      {#if dataset.color != undefined && dataset.color != ''}
        <span class="w-8 h-8 rounded-full mr-2" style={`background-color: ${dataset.color}`} />
      {/if}
      <div class="flex-1 min-w-0">
        <p class="font-bold text-2xl">{dataset.name}</p>
      </div>

      {#if showButtons}
        <div class="flex space-x-2">
          <button
            class="btn btn-sm variant-ringed"
            on:click={() =>
              modalStore.trigger({
                type: 'component',
                component: 'formModalDataset',
                meta: {
                  data: dataset,
                  action: `/widget/${dataset.widgetId}/dataset/${dataset.id}?/update`,
                  title: 'Edit Dataset',
                },
              })}
          >
            <Icon icon="material-symbols:edit-outline" height="18" />
            <span>Edit</span>
          </button>
          <form
            use:enhance
            method="POST"
            action={`/widget/${dataset.widgetId}/dataset/${dataset.id}?/delete`}
            class="flex-initial"
          >
            <button on:click={confirmDelete} class="btn btn-sm variant-ringed">
              <Icon icon="mdi:trash-outline" height="18" />
              <span class="ml-1 mr-1"> Delete </span>
            </button>
          </form>
        </div>
      {/if}
    </div>
  </div>

  <div class="mb-7">
    <p class="text-gray-500">
      {#if dataset.type == 'line'}
        <b>Type: </b>Line
      {:else if dataset.type == 'bar'}
        <b>Type: </b>Bar
      {/if}
    </p>
  </div>

  <div>
    <div class="flex w-full items-center mb-4">
      <span class="items-end text-lg font-light">Queries</span>
      <div class="flex-1" />
      {#if showButtons}
        <button
          class="btn btn-sm variant-filled"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalCustomQuery',
              meta: {
                action: `/widget/${dataset.widgetId}/dataset/${dataset.id}/query?/new`,
                title: 'Add Query',
                showDate: false,
                showDifficulty: false,
                showMigrationOption: false,
              },
            })}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>Add Query</span>
        </button>
      {/if}
    </div>

    <ul class="list space-y-7">
      {#each dataset.customQueries as customQuery}
        <li>
          <CustomQuery
            class="card bg-white py-3 px-2 md:px-4 shadow"
            {showButtons}
            {widget}
            {customQuery}
          />
        </li>
      {/each}
    </ul>
    {#if dataset.customQueries.length == 0}
      <span class="italic text-gray-400">No Queries</span>
    {/if}
  </div>
</div>
