<script lang="ts">
  import { exerciseTypeColors } from '$lib/utils';

  // @ts-ignore
  import Calendar from '@event-calendar/core';
  // @ts-ignore
  import DayGrid from '@event-calendar/day-grid';
  // @ts-ignore
  import Interaction from '@event-calendar/interaction';
  // @ts-ignore
  import TimeGrid from '@event-calendar/time-grid';
  import type { CalendarEvent, JournalEntry, Prisma, TrainingProgram } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';

  export let calendarEvents: CalendarEvent[] = [];
  export let journalEntries: JournalEntry[] = [];
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
  }>[] = [];
  export let exerciseEvents: Prisma.ExerciseEventGetPayload<{
    include: {
      exercise: {
        select: {
          name: true;
          type: true;
        };
      };
    };
  }>[] = [];

  // For the activation modal program select
  export let ownedTrainingPrograms: TrainingProgram[] = [];
  export let savedTrainingPrograms: TrainingProgram[] = [];

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

  let journalEntryEvents = journalEntries.map((j) => {
    return {
      start: dayjs(j.date).startOf('day').toDate(),
      end: dayjs(j.date).startOf('day').toDate(),
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
    start: dayjs(e.dateStart).startOf('day').toDate(),
    end: dayjs(e.dateEnd).startOf('day').toDate(),
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
    start: e.date,
    end: e.date,
    backgroundColor: 'transparent',
    allDay: false,
    title: e.exercise?.name,
    extendedProps: {
      isExerciseEvent: true,
      exerciseEvent: e,
    },
  }));

  $: trainingProgramActivationEvents = [] as any[];
  $: {
    trainingProgramActivationEvents = [];
    trainingProgramActivations.forEach((a) => {
      let startDate = dayjs(a.startDate);
      a.trainingProgram.trainingProgramScheduledSlots.forEach((s) => {
        let endDate = startDate.add(s.duration, 'weeks');
        trainingProgramActivationEvents.push({
          start: startDate.startOf('day').toDate(),
          end: endDate.startOf('day').toDate(),
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
