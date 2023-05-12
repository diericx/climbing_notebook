<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import DayGrid from '@event-calendar/day-grid';
	import Interraction from '@event-calendar/interaction';
	import type { CalendarEvent, JournalEntry } from '@prisma/client';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let calendarEvents: CalendarEvent[];
	export let journalEntries: JournalEntry[];

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
							data: j
						}
					});
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
				modalStore.trigger({
					type: 'component',
					component: 'modalCalendarEvent',
					meta: {
						data: e
					}
				});
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

<Calendar {plugins} {options} />
