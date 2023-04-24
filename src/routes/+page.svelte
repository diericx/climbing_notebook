<script lang="ts">
	import type { PageData } from './$types';
	import type { ProfileWithActiveTrainingProgram } from '$lib/prisma';
	import type { CalendarEvent, JournalEntry } from '@prisma/client';
	import Chart from './chart/chart.svelte';
	import Calendar from './Calendar.svelte';
	import Modal from './Modal.svelte';
	import NewCalendarEventForm from './calendarEvent/form.svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';

	export let data: PageData;
	$: profile = data.profile as ProfileWithActiveTrainingProgram;
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

{#if profile}
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

		<Modal bind:showModal={showJournalEntryModal}>
			<h2 class="font-bold">
				{new Date(journalEntryForModal?.date).toLocaleDateString('en-US') || ''}
			</h2>
			<p class="whitespace-pre-wrap">{journalEntryForModal?.content || ''}</p>
			<div slot="buttons">
				<a href={`/journalEntry/${journalEntryForModal?.id || undefined}/edit`}>
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
{:else}
	<h1>Welcome to the Climbing Notebook</h1>
	<hr />

	<p>
		<br />
		This website is a no-fluff set of tools to help climbers with their training.
		<br />
		This is a <b>very early version</b> and is actively being worked on by myself only.
		<br />
		I am currently jobless and am willing to work on this nearly full time right now.
		<br />
		<br />
		<b>If you want to help out</b> we can chat about what tooling you want added next.
		<br />
		zacharyholland[at]gmail[dot]com
	</p>

	<br />

	<h1>Current Features</h1>
	<hr />
	<br />

	<ul class="roman">
		<li>
			<h2><b>Climbing Journal</b></h2>
			A place to keep nots on progress and more importantly<b>injuries</b> as suggested by MacLeod
			in
			<i>Make or Break (pg. 22, 27)</i>
			<ul class="list-disc px-6">
				<li>Simple and open ended journaling tool; jot notes any day it seems useful</li>
			</ul>
		</li>
		<li>
			<h2><b>Program Editor</b></h2>
			Create complex training programs that will generate a weekly view.
			<br />
			Track completion of these tasks with the exercise log.
		</li>
		<li>
			<h2><b>Exercise Log</b></h2>
			Keep a detailed log of your exercises include repsxsets, times, and other notes.
		</li>
	</ul>
{/if}
