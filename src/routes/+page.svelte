<script lang="ts">
	import type { PageData } from './$types';
	import TrainingProgramWeeklyCalendar from './trainingProgram/weekCalendar.svelte';
	import type { ProfileWithActiveTrainingProgram } from '$lib/prisma';
	import Chart from './chart/chart.svelte';

	export let data: PageData;
	const profile: ProfileWithActiveTrainingProgram =
		data.profile as ProfileWithActiveTrainingProgram;
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
			<div class="whitespace-pre border bg-white w-full px-1 py-3">
				{profile.goals}
			</div>
		{/if}
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
