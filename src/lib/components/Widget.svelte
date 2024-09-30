<script lang="ts">
  import type { trainingProgramSelects } from '$lib/prismaHelpers/trainingProgramHelper';
  import type { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
  import type { CustomQueryResults } from '$lib/server/repos/customQuery';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { Prisma } from '@prisma/client';
  import { modalStore, popup } from '@skeletonlabs/skeleton';
  import Calendar from './Calendar.svelte';
  import Chart from './Chart.svelte';
  import DailyCalendar from './DailyCalendar.svelte';
  import HeatmapCalendar from './HeatmapCalendar.svelte';
  import FormButton from './forms/FormButton.svelte';

  // Generate partial prisma types
  export let widget: Prisma.WidgetGetPayload<typeof widgetSelects.everythingValidator>;
  export let profile: Prisma.ProfileGetPayload<{ select: { weightUnit: true } }>;
  export let customQueryResults: CustomQueryResults[];
  export let trainingCycles: Prisma.TrainingCycleGetPayload<{ select: { name: true } }>[];

  // For the activation modal program select
  export let ownedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof trainingProgramSelects.listMinimalValidator
  >[];
  export let savedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof trainingProgramSelects.listMinimalValidator
  >[];
</script>

<div class="card p-4">
  <div class="w-full flex justify-end mb-4">
    <div class="font-bold w-full">{widget.name}</div>
    <button
      class={`btn !bg-transparent justify-between`}
      use:popup={{
        event: 'click',
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
  </div>

  {#if widget.type == 'chart'}
    {#if widget.datasets.length == 0}
      <p class="text-gray-400 italic">
        Widget is not fully configured yet. Edit the widget to finish configuration.
      </p>
    {:else}
      <div class="h-80">
        <Chart datasets={widget.datasets} {customQueryResults} />
      </div>
    {/if}
  {:else if widget.type == 'calendar'}
    <div>
      <div class="flex justify-start mb-2">
        <button
          class="btn btn-sm variant-filled"
          on:click={() => {
            modalStore.trigger({
              type: 'component',
              component: 'formModalCalendarEvent',
              meta: {
                action: `/calendarEvent?/new`,
                title: 'New Calendar Event',
              },
            });
          }}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>New Calendar Event</span>
        </button>
      </div>

      <div>
        <Calendar {profile} {ownedTrainingPrograms} {savedTrainingPrograms} />
      </div>
    </div>
  {:else if widget.type == 'heatmapCalendar'}
    <div>
      <HeatmapCalendar datasets={widget.datasets} {customQueryResults} />
    </div>
  {:else if widget.type == 'dailyExerciseCalendar'}
    <div class="h-80">
      {#if widget.trainingCycle === null}
        <p class="text-gray-400 italic">
          You must set a Training Cycle for this widget to display exercises.
        </p>
      {:else}
        <DailyCalendar {profile} trainingCycle={widget.trainingCycle} />
      {/if}
    </div>
  {/if}
</div>

<div data-popup={widget.id}>
  <div class="card shadow-xl py-2 z-50">
    <nav class="list-nav">
      <ul>
        <li>
          <button
            class="btn btn-sm mr-2 w-full justify-start"
            on:click={() =>
              modalStore.trigger({
                type: 'component',
                component: 'formModalWidget',
                meta: {
                  action: `/widget/${widget.id}?/update`,
                  title: 'Edit Widget',
                  data: widget,
                  formProps: {
                    widget,
                    showType: false,
                    showSimpleFields: true,
                    showSimpleFieldCheckBoxes: false,
                    trainingCycles,
                  },
                },
              })}
          >
            <Icon icon="material-symbols:edit-outline" height="18" />
            <span>Edit</span>
          </button>
        </li>
        <li>
          <div>
            <a class="btn btn-sm flex justify-start" href={`/widget/${widget.id}/edit`}>
              <Icon icon="material-symbols:edit-outline" height="18" />
              <span>Advanced Editor</span>
            </a>
          </div>
        </li>
        <li>
          <button
            class="btn btn-sm w-full justify-start"
            on:click={() =>
              modalStore.trigger({
                type: 'component',
                component: 'formModalWidgetTemplate',
                meta: {
                  action: `/widget/${widget.id}?/newTemplate&redirectTo=/widget`,
                  title: 'New Community Widget Template',
                  description:
                    'To share widgets you create a Community Widget which will be a duplicate of this one on your dashboard.',
                },
              })}
          >
            <Icon icon="material-symbols:share" height="18" />
            <span>Share Widget</span>
          </button>
        </li>
        <li>
          <FormButton
            action={`/widget/${widget.id}?/delete`}
            class="btn btn-sm w-full justify-start"
            onClick={confirmDelete}
          >
            <Icon icon="mdi:trash-outline" height="18" />
            <span>Delete</span>
          </FormButton>
        </li>
      </ul>
    </nav>
    <div class="arrow bg-white border" />
  </div>
</div>
