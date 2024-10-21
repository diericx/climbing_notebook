<script lang="ts">
  import dayjs from '$lib/dayjs';
  import type { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
  import type { trainingProgramSelects } from '$lib/prismaHelpers/trainingProgramHelper';
  import { exerciseTypeColors } from '$lib/utils';
  // @ts-ignore
  import Calendar from '@event-calendar/core';
  // @ts-ignore
  import DayGrid from '@event-calendar/day-grid';
  // @ts-ignore
  import Interaction from '@event-calendar/interaction';
  // @ts-ignore
  import { getCalendarEvents } from '$lib/api/calendarEvents';
  import { getExerciseEvents } from '$lib/api/exerciseEvents';
  import { getJournalEntries } from '$lib/api/journalEntries';
  import { getTrainingProgramActivations } from '$lib/api/trainingProgramActivations';
  import { Prisma } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { APICalendarEventsResponse } from '../../routes/api/calendarEvents/+server';
  import type { APIExerciseEventsResponse } from '../../routes/api/exerciseEvents/+server';
  import type { APIJournalEntriesResponse } from '../../routes/api/journalEntries/+server';
  import type { APITrainingProgramActivationsResponse } from '../../routes/api/trainingProgramActivations/+server';

  export let profile: Prisma.ProfileGetPayload<{ select: { weightUnit: true } }>;

  // For the activation modal program select
  export let ownedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof trainingProgramSelects.listMinimalValidator
  >[];
  export let savedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof trainingProgramSelects.listMinimalValidator
  >[];

  // The following types are descriptive types for the Calendar data as they are not provided
  type EventExtendedProps = {
    onClick: () => void;
  };
  type Event = {
    start: Date | string;
    end: Date | string;
    backgroundColor: string;
    title: string;
    extendedProps: EventExtendedProps;
    allDay?: boolean;
  };

  // ---
  // Below are helper functions for formatting data into Event objects the Calendar will accept
  // ---

  function formatCalendarEvents(data: APICalendarEventsResponse): Event[] {
    return data.map((e) => ({
      // we use the raw UTC here because we are blocking out DAYS and we want
      // no interference from time
      start: e.dateStart.split('T', 1)[0],
      // Value is exclusive so we need to add a day
      end: dayjs.utc(e.dateEnd).add(1, 'day').toISOString().split('T', 1)[0],
      backgroundColor: e.color,
      allDay: true,
      title: e.title,
      extendedProps: {
        onClick: () => {
          modalStore.trigger({
            type: 'component',
            component: 'modalCalendarEvent',
            meta: {
              data: e,
            },
          });
        },
      },
    }));
  }

  function formatJournalEntries(data: APIJournalEntriesResponse): Event[] {
    return data.map((j) => {
      return {
        start: j.date.split('T', 1)[0],
        end: j.date.split('T', 1)[0],
        backgroundColor: '#7dd3fc',
        allDay: true,
        title: j.content.substring(0, 15),
        extendedProps: {
          onClick: () => {
            modalStore.trigger({
              type: 'component',
              component: 'modalJournalEntry',
              meta: {
                data: j,
              },
            });
          },
        },
      };
    });
  }
  function formatExerciseEvents(data: APIExerciseEventsResponse): Event[] {
    return data.map((e) => ({
      // If the date is null and for some reason in this list, set the date
      // to zero so it won't show up
      start: e.date.split('T', 1)[0] || new Date(0),
      end: e.date.split('T', 1)[0] || new Date(0),
      // start: dayjs.tz(e.date, 'UTC').startOf('day').format(),
      // end: dayjs.tz(e.date, 'UTC').startOf('day').format(),
      backgroundColor: 'transparent',
      allDay: false,
      title: e.exercise?.name || 'Unknown Exercise',
      extendedProps: {
        isExerciseEvent: true,
        exerciseEvent: e,
        onClick: () => {
          modalStore.trigger({
            type: 'component',
            component: 'formModalExerciseEvent',
            meta: {
              data: e,
              title: 'Edit Exercise Event',
              action: `/exerciseEvent/${e.id}?/edit`,
              showDeleteButton: true,
              deleteButtonAction: `/exerciseEvent/${e.id}?/delete`,
              formProps: {
                profile,
              },
            },
          });
        },
      },
    }));
  }

  function formatTrainingProgramActivations(data: APITrainingProgramActivationsResponse): Event[] {
    const events: Event[] = [];
    data.forEach((a) => {
      const { trainingProgramScheduledSlots } = a.trainingProgram;
      // Again we use UTC here because there is no time involved in these
      // data structures
      let startDate = dayjs.tz(a.startDate, 'UTC');
      trainingProgramScheduledSlots.forEach((s, i) => {
        const endDate = startDate.add(s.duration, 'weeks');
        events.push({
          start: startDate.startOf('day').toDate().toISOString().split('T', 1)[0],
          // Subtract one day from the end date if it is not the last one so there
          // is no overlap in the calendar view
          end: (i != trainingProgramScheduledSlots.length - 1
            ? endDate.subtract(1, 'day')
            : endDate
          )
            .startOf('day')
            .toDate()
            .toISOString()
            .split('T', 1)[0],
          backgroundColor: '#8bfca9',
          allDay: true,
          title: `${a.trainingProgram.name} - ${s.trainingCycles[0].name} `,
          extendedProps: {
            onClick: () => {
              modalStore.trigger({
                type: 'component',
                component: 'formModalTrainingProgramActivation',
                meta: {
                  action: `/trainingProgram/${a.trainingProgramId}/activation/${a.id}?/edit`,
                  data: a,
                  title: 'Edit Scheduled Program',
                  showDeleteButton: true,
                  deleteButtonAction: `/trainingProgram/${a.trainingProgramId}/activation/${a.id}?/delete`,
                  formProps: {
                    ownedTrainingPrograms,
                    savedTrainingPrograms,
                  },
                },
              });
            },
          },
        });
        startDate = endDate;
      });
    });
    return events;
  }

  // Seed the start string and end string values
  $: startStr = '';
  $: endStr = '';

  // Create all of the queries if the startStr and endStr have been set, otherwise default to undefined
  // so we don't send in a useless API request
  $: calendarEventsQuery = startStr && endStr ? getCalendarEvents(startStr, endStr) : undefined;
  $: journalEntriesQuery = startStr && endStr ? getJournalEntries(startStr, endStr) : undefined;
  $: exerciseEventsQuery = startStr && endStr ? getExerciseEvents(startStr, endStr) : undefined;
  $: trainingProgramActivationsQuery = getTrainingProgramActivations();

  // Construct events using the reactive data from each of the queries defined above
  let events: Event[] = [];
  $: {
    events = [];
    if ($calendarEventsQuery && !$calendarEventsQuery.isLoading && !$calendarEventsQuery.error) {
      events = [...events, ...formatCalendarEvents($calendarEventsQuery.data)];
    }
    if ($journalEntriesQuery && !$journalEntriesQuery.isLoading && !$journalEntriesQuery.error) {
      events = [...events, ...formatJournalEntries($journalEntriesQuery.data)];
    }
    if ($exerciseEventsQuery && !$exerciseEventsQuery.isLoading && !$exerciseEventsQuery.error) {
      events = [...events, ...formatExerciseEvents($exerciseEventsQuery.data)];
    }
    if (
      $trainingProgramActivationsQuery &&
      !$trainingProgramActivationsQuery.isLoading &&
      !$trainingProgramActivationsQuery.error
    ) {
      events = [
        ...events,
        ...formatTrainingProgramActivations($trainingProgramActivationsQuery.data),
      ];
    }
  }

  // Construct options using events
  const plugins = [DayGrid, Interaction];
  $: options = {
    view: 'dayGridMonth',
    // Note: I don't think the 'editable' option works so we need to specify each one individually
    eventStartEditable: false,
    eventDurationEditable: false,
    firstDay: 1,
    eventTimeFormat: () => {
      return '';
    },
    eventContent: (arg: {
      event: {
        title: string;
        extendedProps?: {
          isExerciseEvent: boolean;
          exerciseEvent?: Prisma.ExerciseEventGetPayload<
            typeof exerciseEventSelects.minimalValidator
          >;
        };
      };
    }) => {
      if (arg.event.extendedProps?.isExerciseEvent) {
        return {
          html: `
          <div class="flex items-start space-x-1">
            <div>
              <div class="w-2 h-2 mt-[6px] shadow-sm rounded-sm ${
                exerciseTypeColors[arg.event.extendedProps?.exerciseEvent?.exercise?.type || ''] ||
                'bg-gray-400'
              }"></div>
            </div>

            <div class="text-gray-500">
            ${arg.event.title}
            </div>

          </div>`,
        };
      }
      return arg.event.title;
    },
    events,
    datesSet: (info: { start: Date; end: Date; startStr: string; endStr: string }) => {
      startStr = info.startStr;
      endStr = info.endStr;
    },
    eventClick: ({ event }: { event: Event }) => {
      event.extendedProps.onClick && event.extendedProps.onClick();
    },
  };
</script>

<Calendar {plugins} {options} />
