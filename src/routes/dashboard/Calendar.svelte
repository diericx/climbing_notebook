<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import DayGrid from '@event-calendar/day-grid';
	import Interraction from '@event-calendar/interaction';
	import type { CalendarEvent, JournalEntry } from '@prisma/client';
	import ModalShowJournalEntry from './ModalShowJournalEntry.svelte';
	import ModalShowCalendarEvent from './ModalShowCalendarEvent.svelte';
	import ModalNewCalendarEvent from './ModalNewCalendarEvent.svelte';

	export let calendarEvents: CalendarEvent[];
	export let journalEntries: JournalEntry[];

	let journalEntry: JournalEntry | undefined = undefined;
	let showModalJournalEntry = false;
	let calendarEvent: CalendarEvent | undefined = undefined;
	let showModalCalendarEvent = false;
	let showModalNewCalendarEvent = false;

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
					journalEntry = j;
					showModalJournalEntry = true;
				}
			}
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
				calendarEvent = e;
				showModalCalendarEvent = true;
			}
		}
	}));

	let plugins = [TimeGrid, DayGrid, Interraction];
	$: options = {
		view: 'dayGridMonth',
		firstDay: 1,
		eventTimeFormat: () => {
			return '';
		},
		pointer: true,
		events: [...journalEntryEvents, ..._calendarEvents],
		eventClick: ({ event }: { event: Event }) => {
			event.extendedProps.onClick();
		}
	};
</script>

<button on:click={() => (showModalNewCalendarEvent = true)}> New Event </button>

<Calendar {plugins} {options} />

<ModalShowJournalEntry bind:showModal={showModalJournalEntry} {journalEntry} />
<ModalShowCalendarEvent bind:showModal={showModalCalendarEvent} {calendarEvent} />
<ModalNewCalendarEvent bind:showModal={showModalNewCalendarEvent} />
