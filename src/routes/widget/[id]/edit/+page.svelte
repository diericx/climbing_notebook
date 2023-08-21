<script lang="ts">
  import Chart from '$lib/components/Chart.svelte';
  import Dataset from '$lib/components/Dataset.svelte';
  import { camelToTitle } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: widget = data.widget;
  $: trainingPrograms = data.trainingPrograms;
  $: customQueryResults = data.customQueryResults;
  $: datasets = widget.datasets;
  $: exercises = data.exercises;
</script>

<div class="flex justify-between mb-8">
  <div>
    <h1 class="font-bold">Editing {widget.name}</h1>
  </div>
  <div class="mb-1">
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

<div class="mb-8">
  <h2>Details</h2>
  <hr class="mb-2" />
  <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
    <div class="flex justify-between">
      <div>
        {#if widget.isTemplate}
          <p><b>Description:</b> {widget.description}</p>
        {/if}
        <p><b>Width:</b> {widget.width}</p>
        {#if !widget.isTemplate}
          <p><b>Order:</b> {widget.order}</p>
        {/if}
        <p><b>Type:</b> {camelToTitle(widget.type)}</p>
        {#if widget.type == 'dailyExerciseCalendar'}
          <p>
            <b>Training Program:</b>
            {widget.trainingProgram?.name || 'Active Training Program'}
          </p>
        {/if}
      </div>
      <div>
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
                formProps: {
                  showType: false,
                  showDescription: widget.isTemplate,
                  showOrder: !widget.isTemplate,
                  trainingPrograms,
                },
              },
            })}
        >
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  </div>
</div>

{#if widget.type == 'chart'}
  <div class="mb-8">
    <h2>Chart Preview</h2>
    <hr class="mb-2" />

    <div class="mb-7 card p-4">
      <Chart {datasets} {customQueryResults} />
    </div>
  </div>
{/if}

{#if widget.type == 'chart' || widget.type == 'heatmapCalendar'}
  <div class="mb-8">
    <div class="mb-2">
      <div class="flex justify-between">
        <div>
          <h2>Simple Editor Fields</h2>
        </div>
      </div>
      <hr />
      <p class="text-gray-400">
        The Simple Editor Fields allows you to present a few fields in the small editor modal from
        the dashboard. You can then use these values in your Dataset Constraints below.
      </p>
    </div>
    <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
      <div class="flex justify-between">
        {#if widget.sets == null && widget.reps == null && widget.weight == null && widget.minutes == null && widget.seconds == null}
          <div class="flex items-center">
            <p class="text-gray-400 inline-block align-middle">
              No simple editor fields defined yet
            </p>
          </div>
        {/if}
        <div>
          <p>
            {#if widget.sets != null}
              <b>sets: </b>{widget.sets}
            {/if}
          </p>
          <p>
            {#if widget.reps != null}
              <b>reps: </b>{widget.reps}
            {/if}
          </p>
          <p>
            {#if widget.weight != null}
              <b>weight: </b>{widget.weight}
            {/if}
          </p>
          <p>
            {#if widget.minutes != null}
              <b>minutes: </b>{widget.minutes}
            {/if}
          </p>
          <p>
            {#if widget.seconds != null}
              <b>seconds: </b>{widget.seconds}
            {/if}
          </p>
        </div>

        <div>
          <button
            class="btn btn-sm variant-ringed mb-1"
            on:click={() =>
              modalStore.trigger({
                type: 'component',
                component: 'formModalWidget',
                meta: {
                  action: `/widget/${widget.id}?/update`,
                  title: 'Simple Editor Fields',
                  description:
                    'The fields you enable here will be available to the user in their dashboard. You can then use them in constraints below.',
                  data: widget,
                  formProps: {
                    showType: false,
                    showOrder: false,
                    showName: false,
                    showWidth: false,
                    showSimpleFields: true,
                    showGoToAdvancedEditorLink: false,
                    trainingPrograms,
                    widget,
                  },
                },
              })}
          >
            <Icon icon="material-symbols:edit-outline" height="18" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  </div>

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
              action: `/widget/${widget.id}/dataset?/new`,
              title: 'Add Dataset',
              formProps: {
                showType: widget.type != 'heatmapCalendar',
                showColor: widget.type != 'heatmapCalendar',
                showEquation: widget.type != 'heatmapCalendar',
              },
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
      <Dataset {exercises} {widget} {dataset} />
    {/each}
  {/if}
{/if}
