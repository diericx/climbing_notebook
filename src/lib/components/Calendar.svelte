<script lang="ts">
  // @ts-ignore
  import Calendar from '@event-calendar/core';
  // @ts-ignore
  import DayGrid from '@event-calendar/day-grid';
  // @ts-ignore
  import Interraction from '@event-calendar/interaction';
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
            };
          };
        };
      };
    };
  }>[] = [];
  // For the activation modal program select
  export let trainingPrograms: TrainingProgram[] = [];

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
      start: j.date,
      end: j.date,
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
    start: e.dateStart,
    end: e.dateEnd,
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

  $: trainingProgramActivationEvents = trainingProgramActivations.map((a) => {
    const startDate = dayjs(a.startDate);
    const durationWeeks = a.trainingProgram.trainingProgramScheduledSlots.reduce(
      (acc, slot) => acc + slot.duration,
      0
    );
    const endDate = startDate.add(durationWeeks, 'week');
    return {
      start: startDate.toDate(),
      end: endDate.toDate(),
      backgroundColor: '#8bfca9',
      allDay: true,
      title: a.trainingProgram.name,
      extendedProps: {
        onClick: () => {
          modalStore.trigger({
            type: 'component',
            component: 'formModalTrainingProgramActivation',
            meta: {
              data: a,
              title: 'Edit Scheduled Program',
              showDeleteButton: true,
              deleteButtonAction: `/trainingProgram/${a.trainingProgramId}/activation/${a.id}?/delete`,
              formProps: {
                trainingPrograms,
              },
            },
          });
        },
      },
    };
  });

  let plugins = [TimeGrid, DayGrid, Interraction];
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
    events: [...trainingProgramActivationEvents, ...journalEntryEvents, ..._calendarEvents],
    eventClick: ({ event }: { event: Event }) => {
      event.extendedProps.onClick();
    },
  };
</script>

<Calendar {plugins} {options} />
