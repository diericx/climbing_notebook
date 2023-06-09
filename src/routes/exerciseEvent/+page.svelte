<script lang="ts">
	import type { PageData } from './$types';

	import type { ExerciseEvent } from '@prisma/client';
	import type { TrainingProgramComplete } from '$lib/prisma';
	import { isDateInTheSameDayAsToday } from '$lib/utils';
	import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
	import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let data: PageData;
	$: activeTrainingProgram = data.profile?.activeTrainingProgram as TrainingProgramComplete;
	$: exerciseEvents = data.exerciseEvents as ExerciseEvent[];
	$: user = data.user;
	$: exercises = data.exercises;

	// Filter out only todays exercise events
	$: todaysExerciseEvents = exerciseEvents.filter((e) => {
		if (e.date == undefined) {
			return false;
		}
		return isDateInTheSameDayAsToday(e.date);
	}) as ExerciseEvent[];

	// Filter out only exercise events that aren't today
	$: pastExerciseEvents = exerciseEvents.filter((e) => {
		if (!e.date) {
			return false;
		}
		const [todayStr] = new Date().toISOString().split('T');
		const [eDateStr] = e.date.toISOString().split('T');
		return eDateStr != todayStr;
	}) as ExerciseEvent[];
</script>

<div class="pb-6">
	<h2>Active Training Program</h2>
	<div>
		{#if !activeTrainingProgram}
			<p class="text-gray-400">
				You don't have an active training program! Go to the <a class="link" href="/trainingProgram"
					>Training Programs</a
				> page to create and set one.
			</p>
		{:else}
			<WeeklyCalendar {user} trainingProgram={activeTrainingProgram} showDuplicateBtn={false} />
		{/if}
	</div>
</div>

<div class="pt-8">
	<div class="flex justify-between">
		<h2>Today</h2>
		<button
			class="btn btn-sm variant-filled mb-2"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: 'formModalExerciseEvent',
					meta: {
						action: `/exerciseEvent?/new`,
						title: 'New Exercise Event',
						exercises
					}
				})}
		>
			<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
			<span>New Exercise Event</span>
		</button>
	</div>
	<ListExerciseEvent exerciseEvents={todaysExerciseEvents} />
</div>

<div class="pt-8">
	<h2>History</h2>
	<ListExerciseEvent exerciseEvents={pastExerciseEvents} />
</div>
