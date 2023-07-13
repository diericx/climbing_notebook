<script lang="ts">
  import { enhance } from '$app/forms';
  import { camelToTitle, confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: widget = data.widget;
  $: customQueries = data.customQueries;
  $: trainingPrograms = data.trainingPrograms;
</script>

<div class="flex justify-between">
  <div>
    <h1>{widget.name}</h1>
  </div>
  <div class="mb-1">
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
  </div>
</div>
<hr />

<div class="mb-8">
  <p><b>Width:</b> {widget.width}</p>
  <p><b>Order:</b> {widget.order}</p>
  <p><b>Type:</b> {camelToTitle(widget.type)}</p>
  {#if widget.type == 'dailyExerciseCalendar'}
    <p><b>Training Program:</b> {widget.trainingProgram?.name || 'Active Training Program'}</p>
  {/if}
</div>

{#if widget.type == 'chart' || widget.type == 'heatmapCalendar'}
  <div class="flex justify-between">
    <div>
      <h2>Datasets</h2>
    </div>
    <div>
      <button
        class="btn btn-sm variant-filled mb-1"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalDataset',
            meta: {
              action: `/widget/${widget.id}?/addDataset`,
              title: 'Add Dataset',
              customQueries,
              showType: widget.type != 'heatmapCalendar',
              showColor: widget.type != 'heatmapCalendar',
              showEquation: widget.type != 'heatmapCalendar',
            },
          })}
      >
        <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
        <span>Add Dataset</span>
      </button>
    </div>
  </div>
  <hr />

  {#if widget.datasets.length == 0}
    <p class="text-gray-400 italic">No Datasets</p>
  {:else}
    {#each widget.datasets as dataset}
      <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
        <div class="flex items-center">
          <div class="flex mb-7 space-x-2 md:space-x-4 w-full items-center justify-between">
            {#if dataset.color != undefined && dataset.color != ''}
              <span class="w-8 h-8 rounded-full" style={`background-color: ${dataset.color}`} />
            {/if}
            <div class="flex-1 min-w-0">
              <p class="font-bold">{dataset.name}</p>
            </div>

            <div class="flex space-x-2">
              <button
                class="btn btn-sm variant-ringed"
                on:click={() =>
                  modalStore.trigger({
                    type: 'component',
                    component: 'formModalDataset',
                    meta: {
                      data: dataset,
                      action: `/widget/${widget.id}/dataset/${dataset.id}?/edit`,
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
                action={`/widget/${widget.id}/dataset/${dataset.id}?/delete`}
                class="flex-initial"
              >
                <button on:click={confirmDelete} class="btn btn-sm variant-ringed">
                  <Icon icon="mdi:trash-outline" height="18" />
                  <span class="ml-1 mr-1"> Delete </span>
                </button>
              </form>
            </div>
          </div>
          <div />
        </div>

        <div>
          <div class="flex w-full items-center mb-2">
            <span class="items-end text-lg font-light">Queries</span>
            <div class="flex-1" />
            <button
              class="btn btn-sm variant-filled"
              on:click={() =>
                modalStore.trigger({
                  type: 'component',
                  component: 'formModalCustomQuery',
                  meta: {
                    action: `/widget/${widget.id}/dataset/${dataset.id}?/newQuery`,
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
          </div>

          <ul class="list">
            {#each dataset.customQueries as customQuery}
              <li class="card bg-white py-3 px-2 md:px-4 mb-2">
                <div class="flex items-center md:space-x-3">
                  <div class="flex-1 min-w-0">
                    <p>{customQuery.name}</p>
                  </div>
                  <div class="flex min-w-0 float-right space-x-2">
                    <button
                      class="btn btn-sm variant-ringed"
                      on:click={() =>
                        modalStore.trigger({
                          type: 'component',
                          component: 'formModalCustomQuery',
                          meta: {
                            data: customQuery,
                            action: `/widget/${widget.id}/dataset/${dataset.id}/customQuery/${customQuery.id}?/edit`,
                            title: 'Edit Exercise Event',
                          },
                        })}
                    >
                      <Icon icon="material-symbols:edit-outline" height="18" />
                      <span>Edit</span>
                    </button>
                    <form
                      class="inline"
                      use:enhance
                      method="POST"
                      action={`/widget/${widget.id}/dataset/${dataset.id}/customQuery/${customQuery.id}?/delete`}
                    >
                      <button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
                        <Icon icon="mdi:trash-outline" height="18" />
                        <span class="ml-1 mr-1"> Delete </span>
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
          {#if dataset.customQueries.length == 0}
            <span class="italic text-gray-400">No Queries</span>
          {/if}
        </div>
      </div>
    {/each}
  {/if}
{/if}
