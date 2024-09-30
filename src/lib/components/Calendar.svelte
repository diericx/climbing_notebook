<script lang="ts">
  import dayjs from '$lib/dayjs';
  import type { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
  import type { trainingProgramSelects } from '$lib/prismaHelpers/trainingProgramHelper';
  import { exerciseTypeColors, getLocalDateWithZeroTime } from '$lib/utils';
  // @ts-ignore
  import Calendar from '@event-calendar/core';
  // @ts-ignore
  import DayGrid from '@event-calendar/day-grid';
  // @ts-ignore
  import Interaction from '@event-calendar/interaction';
  // @ts-ignore
  import TimeGrid from '@event-calendar/time-grid';
  import { Prisma } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { ApiCalendarEventGet } from '../../routes/api/calendar_events/+server';

  export let profile: Prisma.ProfileGetPayload<{ select: { weightUnit: true } }>;

  // For the activation modal program select
  export let ownedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof trainingProgramSelects.listMinimalValidator
  >[];
  export let savedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof trainingProgramSelects.listMinimalValidator
  >[];

  type EventExtendedProps = {
    onClick: () => void;
  };
  type Event = {
    start: Date;
    end: Date;
    backgroundColor: string;
    title: string;
    extendedProps: EventExtendedProps;
  };

  function formatApiCalendarEventResponseToEvents(data: ApiCalendarEventGet): Event[] {
    const events: any[] = [
      ...data.journalEntries.map((j) => {
        return {
          start: getLocalDateWithZeroTime(j.date),
          end: getLocalDateWithZeroTime(j.date),
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
      }),
      ...data.calendarEvents.map((e) => ({
        // we use the raw UTC here because we are blocking out DAYS and we want
        // no interference from time
        start: dayjs.tz(e.dateStart, 'UTC').startOf('day').format(),
        end: dayjs.tz(e.dateEnd, 'UTC').startOf('day').format(),
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
      })),
      ...data.exerciseEvents.map((e) => ({
        // If the date is null and for some reason in this list, set the date
        // to zero so it won't show up
        start: e.date || new Date(0),
        end: e.date || new Date(0),
        // start: dayjs.tz(e.date, 'UTC').startOf('day').format(),
        // end: dayjs.tz(e.date, 'UTC').startOf('day').format(),
        backgroundColor: 'transparent',
        allDay: false,
        title: e.exercise?.name,
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
      })),
    ];

    data.trainingProgramActivations.forEach((a) => {
      const { trainingProgramScheduledSlots } = a.trainingProgram;
      // Again we use UTC here because there is no time involved in these
      // data structures
      let startDate = dayjs.tz(a.startDate, 'UTC');
      trainingProgramScheduledSlots.forEach((s, i) => {
        const endDate = startDate.add(s.duration, 'weeks');
        events.push({
          start: startDate.startOf('day').format(),
          // Subtract one day from the end date if it is not the last one so there
          // is no overlap in the calendar view
          end: (i != trainingProgramScheduledSlots.length - 1
            ? endDate.subtract(1, 'day')
            : endDate
          )
            .startOf('day')
            .format(),
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

  // The calendar does not play nice with making this function Async so we will use traditional
  // promise -> await style
  function fetchCalendarEvents(
    { startStr, endStr }: { startStr: string; endStr: string },
    successCallback: (events: Event[]) => Event[],
    failureCallback: (info: any) => void
  ) {
    fetch(`/api/calendar_events?start=${startStr}&end=${endStr}`)
      .then((res) => res.json())
      .then((d) => {
        successCallback(formatApiCalendarEventResponseToEvents(d));
      })
      .catch((e) => {
        console.error(e);
        failureCallback('There was a server error while fetching calendar events.');
      });

    failureCallback('There was an unknown problem fetching calendar events.');
  }

  const plugins = [TimeGrid, DayGrid, Interaction];
  // Note: I don't think the 'pointer' option works so it is applied via css
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
    eventSources: [
      {
        events: fetchCalendarEvents,
      },
    ],
    eventClick: ({ event }: { event: Event }) => {
      event.extendedProps.onClick && event.extendedProps.onClick();
    },
  };
</script>

<Calendar {plugins} {options} />
