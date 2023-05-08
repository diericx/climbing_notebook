<script lang="ts">
	import type { PageData } from './$types';
	import Chart from '$lib/components/Chart.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	$: profile = data.profile;
	$: journalEntries = data.journalEntries;
	$: calendarEvents = data.calendarEvents;
</script>

<div class="mb-16">
	<div class="flex justify-between mb-2">
		<h1 class="inline">Your Goals</h1>
		<a class="btn btn-sm variant-ringed" href={`/profile/edit?redirectTo=/`}>
			<Icon icon="material-symbols:edit-outline" height="18" />
			<span>Edit</span>
		</a>
	</div>

	<hr />
	{#if !profile.goals || profile.goals == ''}
		<p class="text-gray-400">
			You don't have any goals yet! Edit your <a href={`/profile/edit?redirectTo=/`}>Profile</a> set
			some.
		</p>
	{:else}
		<div class="card p-4 whitespace-pre-wrap">
			{profile.goals}
		</div>
	{/if}
</div>

<div class="mb-16">
	<div class="flex justify-between mb-2">
		<h1>Calendar</h1>
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

	<hr />

	<div>
		<Calendar calendarEvents={calendarEvents || []} journalEntries={journalEntries || []} />
	</div>
</div>

<div>
	<div class="flex justify-between mb-2">
		<h1 class="inline">Charts</h1>
		<a class="btn btn-sm variant-filled" href="/chart/new?redirectTo=/">
			<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
			<span>New Chart</span>
		</a>
	</div>
	<hr />
	<div>
		{#each data.charts as chart}
			<div class="mb-4">
				{#if chart.matchAgainst == 'metrics'}
					<Chart {chart} metrics={data.metrics} />
				{:else if chart.matchAgainst == 'exerciseEvents'}
					<Chart {chart} exerciseEvents={data.exerciseEvents} />
				{/if}
			</div>
		{/each}
	</div>
</div>
