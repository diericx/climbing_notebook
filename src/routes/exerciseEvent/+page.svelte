<script lang="ts">
	import type { PageData, ActionData } from './$types';

	import ExerciseEventForm from './form.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import type { ExerciseEvent } from '@prisma/client';
	import type { ProfileWithActiveTrainingProgram } from '$lib/profile';
	import type { TrainingProgramDayWithExercises } from '$lib/trainingProgramDay';
	import dayjs from 'dayjs';
	import ExerciseEventsList from './list.svelte';

	export let data: PageData;
	export let form: ActionData;
	let exerciseEventFormData: ExerciseEventFormData =
		(form?.journalEntryFormData as ExerciseEventFormData) ||
		new ExerciseEventFormData({ difficulty: 0 });

	// Parse incoming data with type safety
	let profile: ProfileWithActiveTrainingProgram = data.profile;
	let scheduledTrainingProgramDay: TrainingProgramDayWithExercises = profile.activeTrainingProgram
		?.days[new Date().getDay()] as TrainingProgramDayWithExercises;
	let exerciseEvents: ExerciseEvent[] = data.exerciseEvents;

	// Filter out only todays exercise events
	let todaysExerciseEvents: ExerciseEvent[] = exerciseEvents.filter((e) => {
		return dayjs(e.date).format('YYYY-MM-DD') == dayjs(new Date()).format('YYYY-MM-DD');
	});
	// Filter out only exercise events that aren't today
	let pastExerciseEvents: ExerciseEvent[] = exerciseEvents.filter((e) => {
		return dayjs(e.date).format('YYYY-MM-DD') != dayjs(new Date()).format('YYYY-MM-DD');
	});

	function fillExerciseEventFormData(e: ExerciseEvent) {
		exerciseEventFormData.name = e.name;
		exerciseEventFormData.weight = e.weight;
	}
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
			</p>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Weight</th>
						<th>Notes</th>
						<th>Done?</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each scheduledTrainingProgramDay.exercises as exercise}
						{@const completed = todaysExerciseEvents.find((e) => e.name == exercise.name)}
						<tr class={completed ? 'bg-green-100 text-gray-400' : ''}>
							<td>{exercise.name}</td>
							<td>{exercise.weight}</td>
							<td>{exercise.notes}</td>
							<td>{completed ? 'yes' : 'no'}</td>
							<td>
								<button on:click={() => fillExerciseEventFormData(exercise)}>Fill Form Below</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
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
