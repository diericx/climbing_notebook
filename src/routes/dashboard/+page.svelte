<script lang="ts">
	import type { PageData } from './$types';
	import Chart from '../chart/chart.svelte';
	import Calendar from '../Calendar.svelte';

	export let data: PageData;
	$: profile = data.profile;
	$: journalEntries = data.journalEntries;
	$: calendarEvents = data.calendarEvents;
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
			<Chart
				{chart}
				targetObjects={chart.matchAgainst == 'metrics' ? data.metrics : data.exerciseEvents}
			/>
		{/each}
	</div>
</div>
