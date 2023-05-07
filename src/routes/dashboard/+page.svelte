<script lang="ts">
	import type { PageData } from './$types';
	import Chart from '$lib/components/Chart.svelte';
	import Calendar from '$lib/components/Calendar.svelte';

	export let data: PageData;
	$: profile = data.profile;
	$: journalEntries = data.journalEntries;
	$: calendarEvents = data.calendarEvents;
</script>

<br />

<div class="pb-4">
	<h2 class="inline">Your Goals</h2>
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
	<h2>Calendar</h2>
	<hr />

	<div>
		<Calendar calendarEvents={calendarEvents || []} journalEntries={journalEntries || []} />
	</div>
</div>

<div>
	<h1 class="inline">Charts</h1>
	<a href="/chart/new?redirectTo=/">New Chart</a>
	<hr />
	<div>
		{#each data.charts as chart}
			{#if chart.matchAgainst == 'metrics'}
				<Chart {chart} metrics={data.metrics} />
			{:else if chart.matchAgainst == 'exerciseEvents'}
				<Chart {chart} exerciseEvents={data.exerciseEvents} />
			{/if}
		{/each}
	</div>
</div>
