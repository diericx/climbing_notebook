<script lang="ts">
	import { enhance } from '$app/forms';
	import type { CustomQueryResults } from '$lib/customQuery';
	import type { WidgetComplete } from '$lib/prisma';
	import { confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { CalendarEvent, JournalEntry } from '@prisma/client';
	import { modalStore } from '@skeletonlabs/skeleton';
	import Calendar from './Calendar.svelte';
	import Chart from './Chart.svelte';
	import HeatmapCalendar from './HeatmapCalendar.svelte';

	export let widget: WidgetComplete;
	export let customQueryResults: CustomQueryResults[];
	export let calendarEvents: CalendarEvent[];
	export let journalEntries: JournalEntry[];
</script>

<div class="card p-4">
	<div class="w-full flex justify-end mb-4">
		<div class="font-bold w-full">{widget.name}</div>
		<a class="btn btn-sm variant-ringed mr-2" href={`/widget/${widget.id}`}>
			<Icon icon="material-symbols:edit-outline" height="18" />
			<span>Edit</span>
		</a>
		<form method="POST" action={`/widget/${widget.id}?/delete`} use:enhance>
			<input type="hidden" name="id" value={widget.id} />
			<button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
				<Icon icon="mdi:trash-outline" height="18" />
				Delete
			</button>
		</form>
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
								title: 'New Calendar Event'
							}
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
	{/if}
</div>
