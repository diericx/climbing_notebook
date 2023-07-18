<script lang="ts">
  import { enhance } from '$app/forms';
  import { camelToTitle, confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import Chart from '$lib/components/Chart.svelte';

  export let data: PageData;
  $: widget = data.widget;
  $: trainingPrograms = data.trainingPrograms;
  $: customQueryResults = data.customQueryResults;
  $: datasets = widget.datasets;

  $: {
    console.log(datasets);
  }
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

<div class="mb-7">
  <p><b>Width:</b> {widget.width}</p>
  <p><b>Order:</b> {widget.order}</p>
  <p><b>Type:</b> {camelToTitle(widget.type)}</p>
  {#if widget.type == 'dailyExerciseCalendar'}
    <p><b>Training Program:</b> {widget.trainingProgram?.name || 'Active Training Program'}</p>
  {/if}
</div>

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
      <button
        class="btn btn-sm variant-filled mb-1"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalDataset',
            meta: {
              action: `/widget/${widget.id}?/addDataset`,
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
    </div>
  </div>
  <hr />

  {#if widget.datasets.length == 0}
    <p class="text-gray-400 italic">No Datasets</p>
  {:else}
    {#each widget.datasets as dataset}
      <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
        <div class="flex items-center mb-1">
          <div class="flex w-full items-center justify-between">
            {#if dataset.color != undefined && dataset.color != ''}
              <span
                class="w-8 h-8 rounded-full mr-2"
                style={`background-color: ${dataset.color}`}
              />
            {/if}
            <div class="flex-1 min-w-0">
              <p class="font-bold text-2xl">{dataset.name}</p>
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
                      action: `/widget/${widget.id}/dataset/${dataset.id}?/update`,
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
            <button
              class="btn btn-sm variant-filled"
              on:click={() =>
                modalStore.trigger({
                  type: 'component',
                  component: 'formModalCustomQuery',
                  meta: {
                    action: `/widget/${widget.id}/dataset/${dataset.id}/query?/new`,
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
              <li class="card bg-white py-3 px-2 md:px-4 mb-7 shadow">
                <div>
                  <div class="flex items-center md:space-x-3 mb-1">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center">
                        <Icon icon="mdi:sql-query" class="mr-1" height="24" />
                        <p class="font-bold text-lg">{customQuery.name}</p>
                      </div>
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
                              action: `/widget/${widget.id}/dataset/${dataset.id}/query/${customQuery.id}?/update`,
                              title: 'Edit Query',
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
                        action={`/widget/${widget.id}/dataset/${dataset.id}/query/${customQuery.id}?/delete`}
                      >
                        <button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
                          <Icon icon="mdi:trash-outline" height="18" />
                          <span class="ml-1 mr-1"> Delete </span>
                        </button>
                      </form>
                    </div>
                  </div>

                  <div class="mb-7 text-gray-500">
                    <b>Resource:</b>
                    {customQuery.table}
                    <br />
                    <b>Equation:</b>
                    {customQuery.equation}
                  </div>

                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="items-end text-lg font-light">Constraints</span>
                      <button
                        class="btn btn-sm variant-filled"
                        on:click={() =>
                          modalStore.trigger({
                            type: 'component',
                            component: 'formModalCustomQueryCondition',
                            meta: {
                              action: `/widget/${widget.id}/dataset/${dataset.id}/query/${customQuery.id}/condition?/new`,
                              title: 'Add Constraint',
                              query: customQuery,
                            },
                          })}
                      >
                        <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
                        <span>Add Constraint</span>
                      </button>
                    </div>
                    <div>
                      {#if customQuery.conditions.length == 0}
                        <i class="text-gray-400">No query conditions</i>
                      {:else}
                        <div class="divide-y border-t">
                          {#each customQuery.conditions as condition}
                            <div class="flex justify-between py-3">
                              <div>
                                <code class="code">
                                  {condition.column}
                                </code>
                                {condition.condition}
                                <code class="code">
                                  {condition.value}
                                </code>
                              </div>
                              <div>
                                <button
                                  class="btn btn-sm variant-ringed"
                                  on:click={() =>
                                    modalStore.trigger({
                                      type: 'component',
                                      component: 'formModalCustomQueryCondition',
                                      meta: {
                                        query: customQuery,
                                        data: condition,
                                        action: `/widget/${widget.id}/dataset/${dataset.id}/query/${customQuery.id}/condition/${condition.id}?/update`,
                                        title: 'Edit Constraint',
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
                                  action={`/widget/${widget.id}/dataset/${dataset.id}/query/${customQuery.id}/condition/${condition.id}?/delete`}
                                >
                                  <button
                                    class="btn btn-sm variant-ringed"
                                    on:click={confirmDelete}
                                  >
                                    <Icon icon="mdi:trash-outline" height="18" />
                                    <span class="ml-1 mr-1"> Delete </span>
                                  </button>
                                </form>
                              </div>
                            </div>
                          {/each}
                        </div>
                      {/if}
                    </div>
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
