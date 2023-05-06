<script lang="ts">
	import type { PageData } from './$types';

	import type { ExerciseEvent } from '@prisma/client';
	import type { TrainingProgramComplete } from '$lib/prisma';
	import { isDateInTheSameDayAsToday } from '$lib/utils';
	import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
	import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
	import ModalExerciseEvent from '$lib/components/modals/ModalExerciseEvent.svelte';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	$: activeTrainingProgram = data.profile?.activeTrainingProgram as TrainingProgramComplete;
	$: exerciseEvents = data.exerciseEvents as ExerciseEvent[];

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
		return eDateStr < todayStr;
	}) as ExerciseEvent[];
</script>

<h1>Weekly Program Calendar</h1>

<div class="pb-6">
	<div>
		{#if !activeTrainingProgram}
			<p class="text-gray-400">
				You don't have an active training program! Go to the <a href="/trainingProgram"
					>Training Programs</a
				> page to create and set one.
			</p>
		{:else}
			<p>
				<span class="text-gray-400 italic">
					Exercises are completed automatically if an exercise is logged below on the same day with
					the matching name.
					<br />
					Use the check box to manually mark something completed <b>without recording any data.</b>
				</span>
			</p>

			<br />

			<WeeklyCalendar trainingProgram={activeTrainingProgram} />
		{/if}
	</div>
</div>

<div class="pt-8">
	<ModalExerciseEvent
		action="/exerciseEvent?/newExerciseEvent"
		title="New Exercise Event"
		let:changeShowModal
		showDate
		showDifficulty
	>
		<div slot="open-modal-buttons" class="mb-2">
			<button class="icon-button ml-0" on:click={() => changeShowModal(true)}>
				<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
				<span class="ml-1 mr-1">New Exercise Event </span>
			</button>
		</div>
	</ModalExerciseEvent>
	<h2>Today</h2>
	<hr />
	<ListExerciseEvent exerciseEvents={todaysExerciseEvents} />
</div>

<div class="pt-8">
	<h2>History</h2>
	<hr />
	<ListExerciseEvent exerciseEvents={pastExerciseEvents} />
</div>
