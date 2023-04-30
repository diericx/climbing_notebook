<script lang="ts">
	import type { PageData } from './$types';
	import type { CalendarEvent, JournalEntry } from '@prisma/client';
	import Chart from '../chart/chart.svelte';
	import Calendar from '../Calendar.svelte';
	import Modal from '../Modal.svelte';
	import NewCalendarEventForm from '../calendarEvent/form.svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';

	export let data: PageData;
	$: profile = data.profile;
	$: journalEntries = data.journalEntries;
	$: calendarEvents = data.calendarEvents;

	let showJournalEntryModal = false;
	let journalEntryForModal: JournalEntry | undefined = undefined;

	let showNewCalendarEventModal = false;
	let showCalendarEventModal = false;
	let calendarEventForModal: CalendarEvent | undefined = undefined;

	function onJournalEntryCalEventClick(j: JournalEntry) {
		journalEntryForModal = j;
		showJournalEntryModal = true;
	}

	function onCalendarEventClick(c: CalendarEvent) {
		showCalendarEventModal = true;
		calendarEventForModal = c;
	}
</script>

<br />

<div class="pb-4">
	<h1 class="inline">Your Goals</h1>
	<a href={`/profile/edit?redirectTo=/`}>Edit</a>

	<hr />
	{#if !profile.goals || profile.goals == ''}
		<p class="text-gray-400">
			You don't have any goals yet! Edit your <a href={`/profile/edit?redirectTo=/`}>Profile</a> set
			some.
		</p>
	{:else}
		<div class="whitespace-pre-wrap border bg-white w-full px-1 py-3">
			{profile.goals}
		</div>
	{/if}
</div>

<div>
	<h1>Calendar</h1>
	<hr />

	<button on:click={() => (showNewCalendarEventModal = true)}> New Event </button>

	<div>
		<Calendar
			calendarEvents={calendarEvents || []}
			journalEntries={journalEntries || []}
			{onJournalEntryCalEventClick}
			{onCalendarEventClick}
		/>
	</div>
</div>

<div>
	<h1 class="inline">Charts</h1>
	<a href="/chart/new?redirectTo=/">New Chart</a>
	<hr />
	<div>
		{#each data.charts as chart}
			<Chart
				{chart}
				targetObjects={chart.matchAgainst == 'metrics' ? data.metrics : data.exerciseEvents}
			/>
		{/each}
	</div>
</div>

<Modal bind:showModal={showJournalEntryModal}>
	<h2 class="font-bold">
		{new Date(journalEntryForModal?.date || '').toLocaleDateString('en-US') || ''}
	</h2>
	<p class="whitespace-pre-wrap">{journalEntryForModal?.content || ''}</p>
	<div slot="buttons">
		<a href={`/journalEntry/${journalEntryForModal?.id || undefined}/edit?redirectTo=/`}>
			<button class="inline-flex">Edit</button>
		</a>
	</div>
</Modal>

<Modal bind:showModal={showNewCalendarEventModal}>
	<h1>New Calendar Event</h1>
	<NewCalendarEventForm
		action="/calendarEvent?/newCalendarEvent"
		successCallback={async () => {
			showNewCalendarEventModal = false;
			await invalidateAll();
		}}
	/>
</Modal>

<Modal bind:showModal={showCalendarEventModal}>
	<h1>{calendarEventForModal?.title}</h1>
	{#if calendarEventForModal?.content}
		<p class="whitespace-pre-wrap">{calendarEventForModal?.content}</p>
	{:else}
		<p class="italic text-gray-400">No content</p>
	{/if}

	<div class="w-full" slot="buttons">
		<a href={`/calendarEvent/${calendarEventForModal?.id || undefined}/edit?redirectTo=/`}>
			<button class="inline-flex">Edit</button>
		</a>
		<form
			method="POST"
			action={`/calendarEvent/${calendarEventForModal?.id}/edit?/deleteCalendarEvent`}
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type == 'success') {
						await invalidateAll();
						showCalendarEventModal = false;
					}
				};
			}}
			class="inline-flex float-right"
		>
			<input type="hidden" name="id" value={calendarEventForModal?.id} />
			<button on:click={confirmDelete}>Delete</button>
		</form>
	</div>
</Modal>
