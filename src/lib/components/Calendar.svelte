<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import DayGrid from '@event-calendar/day-grid';
	import Interraction from '@event-calendar/interaction';
	import type { CalendarEvent, JournalEntry } from '@prisma/client';
	import ModalShowJournalEntry from '$lib/components/modals/ModalShowJournalEntry.svelte';
	import ModalShowCalendarEvent from '$lib/components/modals/ModalShowCalendarEvent.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	export let calendarEvents: CalendarEvent[];
	export let journalEntries: JournalEntry[];

	let journalEntry: JournalEntry | undefined = undefined;
	let showModalJournalEntry = false;
	let calendarEvent: CalendarEvent | undefined = undefined;
	let showModalCalendarEvent = false;

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

<button
	class="btn btn-sm variant-filled"
	on:click={() =>
		modalStore.trigger({
			type: 'component',
			component: 'formModalCalendarEvent',
			meta: {
				action: `/calendarEvent?/new`,
				title: 'New Calendar Event'
			}
		})}
>
	<Icon icon="material-symbols:edit-outline" height="18" />
	<span>New Calendar Event</span>
</button>
<Calendar {plugins} {options} />

<ModalShowJournalEntry bind:showModal={showModalJournalEntry} {journalEntry} />
<ModalShowCalendarEvent bind:showModal={showModalCalendarEvent} {calendarEvent} />
