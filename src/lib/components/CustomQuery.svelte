<script lang="ts">
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { Prisma, Widget } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormButton from './forms/FormButton.svelte';

  type CustomQuery = Prisma.CustomQueryGetPayload<{
    include: {
      exercise: {
        select: {
          name: true;
        };
      };
      conditions: true;
    };
  }>;

  export let widget: Widget;
  export let customQuery: CustomQuery;
  export let exercises: Prisma.ExerciseGetPayload<{
    select: {
      name: true;
    };
  }>[];

  let className: string = '';
  export { className as class };
  export let showButtons = true;
</script>

<div class={className}>
  <div class="flex items-center md:space-x-3 mb-1">
    <div class="flex-1 min-w-0">
      <div class="flex items-center">
        <Icon icon="mdi:sql-query" class="mr-1" height="24" />
        <p class="font-bold text-lg">{customQuery.name}</p>
      </div>
    </div>
    {#if showButtons}
      <div class="flex min-w-0 float-right space-x-2">
        <button
          class="btn btn-sm variant-ringed"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalCustomQuery',
              meta: {
                data: customQuery,
                action: `/widget/${widget.id}/dataset/${customQuery.datasetId}/query/${customQuery.id}?/update`,
                title: 'Edit Query',
                formProps: {
                  exercises,
                },
              },
            })}
        >
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span>Edit</span>
        </button>
        <FormButton
          action={`/widget/${widget.id}/dataset/${customQuery.datasetId}/query/${customQuery.id}?/delete`}
          class="btn btn-sm variant-ringed"
          onClick={confirmDelete}
        >
          <Icon icon="mdi:trash-outline" height="18" />
          <span class="ml-1 mr-1"> Delete </span>
        </FormButton>
      </div>
    {/if}
  </div>

  <div class="mb-7 text-gray-500">
    <b>Resource:</b>
    {customQuery.table}
    <br />
    <b>Equation:</b>
    {customQuery.equation}
    <br />
    {#if customQuery.table == 'metric'}
      <b>Metric: </b>
      {customQuery.metric}
    {:else if customQuery.table == 'exerciseEvent'}
      <b>Exercise: </b>
      {customQuery.exercise?.name}
    {/if}
  </div>

  <div>
    <div class="flex justify-between mb-2">
      <span class="items-end text-lg font-light">Constraints</span>
      {#if showButtons}
        <button
          class="btn btn-sm variant-filled"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalCustomQueryCondition',
              meta: {
                action: `/widget/${widget.id}/dataset/${customQuery.datasetId}/query/${customQuery.id}/condition?/new`,
                title: 'Add Constraint',
                formProps: {
                  widget: widget,
                  query: customQuery,
                },
              },
            })}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>Add Constraint</span>
        </button>
      {/if}
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
                {#if condition.useWidgetField}
                  <code class="code">
                    {condition.widgetFieldToUse}
                  </code> field from Simple Editor
                {:else}
                  <code class="code">
                    {condition.value}
                  </code>
                {/if}
              </div>
              {#if showButtons}
                <div>
                  <button
                    class="btn btn-sm variant-ringed"
                    on:click={() =>
                      modalStore.trigger({
                        type: 'component',
                        component: 'formModalCustomQueryCondition',
                        meta: {
                          action: `/widget/${widget.id}/dataset/${customQuery.datasetId}/query/${customQuery.id}/condition/${condition.id}?/update`,
                          title: 'Edit Constraint',
                          data: condition,
                          formProps: {
                            query: customQuery,
                            widget: widget,
                          },
                        },
                      })}
                  >
                    <Icon icon="material-symbols:edit-outline" height="18" />
                    <span>Edit</span>
                  </button>
                  <FormButton
                    action={`/widget/${widget.id}/dataset/${customQuery.datasetId}/query/${customQuery.id}/condition/${condition.id}?/delete`}
                    class="btn btn-sm variant-ringed"
                    onClick={confirmDelete}
                  >
                    <Icon icon="mdi:trash-outline" height="18" />
                    <span class="ml-1 mr-1"> Delete </span>
                  </FormButton>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
