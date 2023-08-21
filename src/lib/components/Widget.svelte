<script lang="ts">
  import type { CustomQueryResults } from '$lib/customQuery';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { CalendarEvent, JournalEntry, Prisma, TrainingProgram } from '@prisma/client';
  import { modalStore, popup } from '@skeletonlabs/skeleton';
  import Calendar from './Calendar.svelte';
  import Chart from './Chart.svelte';
  import DailyCalendar from './DailyCalendar.svelte';
  import HeatmapCalendar from './HeatmapCalendar.svelte';
  import FormButton from './forms/FormButton.svelte';

  // Generate partial prisma types
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
      trainingProgram: {
        include: {
          days: {
            include: {
              exercises: {
                include: {
                  exercise: true;
                };
              };
              exerciseGroups: {
                include: {
                  exercises: {
                    include: {
                      exercise: true;
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  }>;

  type Profile = Prisma.ProfileGetPayload<{
    include: {
      activeTrainingProgram: {
        include: {
          days: {
            include: {
              exercises: {
                include: {
                  exercise: true;
                };
              };
              exerciseGroups: {
                include: {
                  exercises: {
                    include: {
                      exercise: true;
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  }>;

  export let widget: Widget;
  export let customQueryResults: CustomQueryResults[];
  export let calendarEvents: CalendarEvent[];
  export let journalEntries: JournalEntry[];
  export let profile: Profile;
  export let trainingPrograms: TrainingProgram[];
</script>

<div class="card card-hover p-4">
  <a href={`/widget/${widget.id}/edit`}>
    <div class="w-full flex justify-end mb-4">
      <div class="font-bold w-full">{widget.name}</div>
      <button
        class={`btn !bg-transparent justify-between`}
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
    </div>

    {#if widget.type == 'chart'}
      {#if widget.datasets.length == 0}
        <p class="text-gray-400 italic">
          Widget is not fully configured yet. Edit the widget to finish configuration.
        </p>
      {:else}
        <Chart datasets={widget.datasets} {customQueryResults} />
      {/if}
    {:else if widget.type == 'calendar'}
      <div>
        <div class="flex justify-start mb-2">
          <button
            class="btn btn-sm variant-filled"
            on:click={() =>
              modalStore.trigger({
                type: 'component',
                component: 'formModalCalendarEvent',
                meta: {
                  action: `/calendarEvent?/new`,
                  title: 'New Calendar Event',
                },
              })}
          >
            <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
            <span>New Calendar Event</span>
          </button>
        </div>

        <div>
          <Calendar calendarEvents={calendarEvents || []} journalEntries={journalEntries || []} />
        </div>
      </div>
    {:else if widget.type == 'heatmapCalendar'}
      <div>
        <HeatmapCalendar datasets={widget.datasets} {customQueryResults} />
      </div>
    {:else if widget.type == 'dailyExerciseCalendar'}
      {#if widget.trainingProgram === null}
        {#if profile.activeTrainingProgram == null}
          <p class="text-gray-400 italic">
            This widget is set to use an active training program but no active training program was
            found.
          </p>
        {:else}
          <DailyCalendar trainingProgram={profile.activeTrainingProgram} />
        {/if}
      {:else}
        <DailyCalendar trainingProgram={widget.trainingProgram || profile.activeTrainingProgram} />
      {/if}
    {/if}
  </a>
</div>

<div class="card shadow-xl py-2 z-50" data-popup={widget.id}>
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
                  trainingPrograms,
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
  <div class="arrow bg-surface-100-800-token" />
</div>
