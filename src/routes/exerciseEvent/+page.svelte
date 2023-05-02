<script lang="ts">
	import type { PageData, ActionData } from './$types';

	import ExerciseEventForm from './form.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import type { ExerciseEvent } from '@prisma/client';
	import type { TrainingProgramComplete } from '$lib/prisma';
	import { getDayWeekStartsMonday, isDateInTheSameDayAsToday } from '$lib/utils';
	import { isDateInTheSameWeekAsToday } from '$lib/utils';
	import ExerciseEventsList from './list.svelte';
	import WeeklyCalendar from './weekCalendar.svelte';
	import ModalExerciseEvent from '../trainingProgram/[id]/edit/ModalExerciseEvent.svelte';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	export let form: ActionData;
	let exerciseEventFormData: ExerciseEventFormData = new ExerciseEventFormData(
		form?.exerciseEventFormData
	);

	$: activeTrainingProgram = data.profile?.activeTrainingProgram as TrainingProgramComplete;
	$: exerciseEvents = data.exerciseEvents as ExerciseEvent[];

	// Filter out only todays exercise events
	$: todaysExerciseEvents = exerciseEvents.filter((e) => {
		if (e.date == undefined) {
			return false;
		}
		return isDateInTheSameDayAsToday(e.date);
	}) as ExerciseEvent[];

	// Filter out only this weeks exercise events
	$: thisWeeksExerciseEvents = exerciseEvents.filter((e) => {
		if (!e.date) {
			return false;
		}
		return isDateInTheSameWeekAsToday(e.date);
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

	// Takes in an exercise event and fills the form on this page with the
	// respective data
	function fillExerciseEventForm(e: ExerciseEvent) {
		exerciseEventFormData.name = e.name;
		exerciseEventFormData.sets = e.sets;
		exerciseEventFormData.reps = e.reps;
		exerciseEventFormData.weight = e.weight;
		exerciseEventFormData.minutes = e.minutes;
		exerciseEventFormData.seconds = e.seconds;

		// Focus the form element
		const el = document.querySelector('#exerciseEventForm');
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

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

			<WeeklyCalendar
				trainingProgram={activeTrainingProgram}
				fillExerciseEventFormFunc={fillExerciseEventForm}
			/>
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
	<ExerciseEventsList exerciseEvents={todaysExerciseEvents} />
</div>

<div class="pt-8">
	<h2>History</h2>
	<hr />
	<ExerciseEventsList exerciseEvents={pastExerciseEvents} />
</div>
