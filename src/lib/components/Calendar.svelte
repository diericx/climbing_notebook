<script lang="ts">
  import dayjs from '$lib/dayjs';
  import type { calendarEventSelects } from '$lib/prismaHelpers/calendarEventHelper';
  import type { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
  import type { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
  import type { TrainingProgramRepo } from '$lib/trainingProgram';
  import { exerciseTypeColors } from '$lib/utils';
  // @ts-ignore
  import Calendar from '@event-calendar/core';
  // @ts-ignore
  import DayGrid from '@event-calendar/day-grid';
  // @ts-ignore
  import Interaction from '@event-calendar/interaction';
  // @ts-ignore
  import TimeGrid from '@event-calendar/time-grid';
  import type { Prisma } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';

  export let calendarEvents: Prisma.CalendarEventGetPayload<
    typeof calendarEventSelects.everythingValidator
  >[];
  export let journalEntries: Prisma.JournalEntryGetPayload<
    typeof journalEntrySelects.minimalValidator
  >[];
  export let trainingProgramActivations: Prisma.TrainingProgramActivationGetPayload<{
    include: {
      trainingProgram: {
        select: {
          name: true;
          trainingProgramScheduledSlots: {
            select: {
              duration: true;
              trainingCycles: {
                select: {
                  name: true;
                };
              };
            };
          };
        };
      };
    };
  }>[];
  export let exerciseEvents: Prisma.ExerciseEventGetPayload<
    typeof exerciseEventSelects.minimalValidator
  >[];

  // For the activation modal program select
  export let ownedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof TrainingProgramRepo.selectEverythingValidator
  >[];
  export let savedTrainingPrograms: Prisma.TrainingProgramGetPayload<
    typeof TrainingProgramRepo.selectEverythingValidator
  >[];
  // For the exercise event form modals
  export let exercises: Prisma.ExerciseGetPayload<{
    select: {
      _count: {
        select: {
          exerciseEvents: true;
        };
      };
      id: true;
      name: true;
      fieldsToShow: true;
    };
  }>[];

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

  $: journalEntryEvents = journalEntries.map((j) => {
    return {
      start: dayjs.tz(j.date, 'UTC').startOf('day').format(),
      end: dayjs.tz(j.date, 'UTC').startOf('day').format(),
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

  $: _calendarEvents = calendarEvents.map((e) => ({
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
  }));

  $: _exerciseEvents = exerciseEvents.map((e) => ({
    start: dayjs.tz(e.date, 'UTC').startOf('day').format(),
    end: dayjs.tz(e.date, 'UTC').startOf('day').format(),
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
              exercises,
            },
          },
        });
      },
    },
  }));

  $: trainingProgramActivationEvents = [] as any[];
  $: {
    trainingProgramActivationEvents = [];
    trainingProgramActivations.forEach((a) => {
      const { trainingProgramScheduledSlots } = a.trainingProgram;
      let startDate = dayjs.tz(a.startDate, 'UTC');
      trainingProgramScheduledSlots.forEach((s, i) => {
        let endDate = startDate.add(s.duration, 'weeks');
        trainingProgramActivationEvents.push({
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
    trainingProgramActivationEvents = trainingProgramActivationEvents;
  }

  let plugins = [TimeGrid, DayGrid, Interaction];
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
          exerciseEvent?: (typeof exerciseEvents)[number];
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
    events: [
      ...trainingProgramActivationEvents,
      ...journalEntryEvents,
      ..._calendarEvents,
      ..._exerciseEvents,
    ],
    eventClick: ({ event }: { event: Event }) => {
      event.extendedProps.onClick && event.extendedProps.onClick();
    },
  };
</script>

<Calendar {plugins} {options} />
