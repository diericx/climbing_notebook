<script lang="ts">
	import type { PageData, ActionData } from './$types';

	import ExerciseEventForm from './form.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import type { ExerciseEvent } from '@prisma/client';
	import type { ProfileWithActiveTrainingProgram } from '$lib/prisma';
	import type { TrainingProgramDayWithExercises } from '$lib/prisma';
	import dayjs from 'dayjs';
	import ExerciseEventsList from './list.svelte';
	import WeeklyCalendar from '../trainingProgram/weekCalendar.svelte';
	import { getMonday } from '$lib/utils';

	export let data: PageData;
	export let form: ActionData;
	let exerciseEventFormData: ExerciseEventFormData = new ExerciseEventFormData(
		form?.exerciseEventFormData
	);

	// Parse incoming data with type safety
	let profile: ProfileWithActiveTrainingProgram = data.profile;
	var numberdayweek = [6, 0, 1, 2, 3, 4, 5];
	let scheduledTrainingProgramDay: TrainingProgramDayWithExercises = profile.activeTrainingProgram
		?.days[numberdayweek[new Date().getDay()]] as TrainingProgramDayWithExercises;

	$: exerciseEvents = data.exerciseEvents as ExerciseEvent[];

	// Filter out only todays exercise events
	$: todaysExerciseEvents = exerciseEvents.filter((e) => {
		return dayjs(e.date).format('YYYY-MM-DD') == dayjs(new Date()).format('YYYY-MM-DD');
	}) as ExerciseEvent[];

	// Filter out only this weeks exercise events
	const today = new Date();
	const monday = getMonday(today);
	$: thisWeeksExerciseEvents = exerciseEvents.filter((e) => {
		const [exerciseDateStr] = new Date(e.date).toISOString().split('T');
		const [mondayStr] = monday.toISOString().split('T');
		const [todayStr] = today.toISOString().split('T');
		return exerciseDateStr >= mondayStr && exerciseDateStr <= todayStr;
	}) as ExerciseEvent[];

	// Filter out only exercise events that aren't today
	$: pastExerciseEvents = exerciseEvents.filter((e) => {
		return dayjs(e.date).format('YYYY-MM-DD') != dayjs(new Date()).format('YYYY-MM-DD');
	}) as ExerciseEvent[];

	function fillExerciseEventFormData(e: ExerciseEvent) {
		exerciseEventFormData.name = e.name;
		exerciseEventFormData.sets = e.sets;
		exerciseEventFormData.reps = e.reps;
		exerciseEventFormData.weight = e.weight;
	}

	$: isExerciseCompleted = (e: ExerciseEvent) => {
		return (
			thisWeeksExerciseEvents.find((_e) => {
				return e.name == _e.name;
			}) != undefined
		);
	};
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<h1>Training Log</h1>
<br />

<div class="pb-6">
	<div>
		<h2>Today's Schedule</h2>
		<hr />
		{#if !scheduledTrainingProgramDay}
			<p class="text-gray-400">
				You don't have an active training program! Go to the <a href="/trainingProgram"
					>Training Programs</a
				> page to create and set one.
			</p>
		{:else}
			<p>
				<b>Description: </b>{scheduledTrainingProgramDay.description}
			</p>
			<p>
				<b>Exercises: </b>
				<br />
				<span class="text-gray-400 italic"
					>Exercises are considered completed if they have been done within the week.
					<br />
					Click an exercise to fill the form below.
				</span>
			</p>

			<WeeklyCalendar
				trainingProgram={profile.activeTrainingProgram}
				fillBelowFunc={fillExerciseEventFormData}
				{isExerciseCompleted}
				showFillButton
			/>
		{/if}
	</div>
</div>

<div>
	<div>
		<h2>New Entry</h2>
		<hr />
		<ExerciseEventForm {exerciseEventFormData} />
	</div>
</div>

<div class="pt-8">
	<h2>Today</h2>
	<hr />
	<ExerciseEventsList exerciseEvents={todaysExerciseEvents} />
</div>

<div class="pt-8">
	<h2>History</h2>
	<hr />
	<ExerciseEventsList exerciseEvents={pastExerciseEvents} />
</div>
