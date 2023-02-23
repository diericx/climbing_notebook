<script lang="ts">
	import { onMount } from 'svelte';
	import { TrainingProgramDayFormData, type TrainingProgramFormData } from '$lib/trainingProgram';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import ExerciseEventForm from '../trainingLog/minimalInlineForm.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';

	export let trainingProgramFormData: TrainingProgramFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';

	let daysOfTheWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];

	function addExercise(e, d: TrainingProgramDayFormData, i) {
		e.preventDefault();
		d.exercises = [...d.exercises, new ExerciseEventFormData()];
		trainingProgramFormData.days = [...trainingProgramFormData.days];
	}
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="name">Name</label>
	<br />
	<input
		name="name"
		placeholder="Upper body + hang board"
		bind:value={trainingProgramFormData.name}
		style="min-width: 300px"
	/>
	<br />
	<br />

	{#each trainingProgramFormData.days as day, i}
		<div class="pb-8">
			<h2>
				<b>{daysOfTheWeek[i]}</b>
			</h2>

			<div class="pl-3">
				<label for="description">Description</label>
				<br />
				<input
					name="description"
					placeholder="Rest Day"
					bind:value={day.description}
					style="min-width: 300px"
				/>

				<h3>Exercises</h3>
				<hr />

				<br />
				{#each day.exercises as exercise, j}
					<ExerciseEventForm exerciseEventFormData={exercise} inline={true} />
				{/each}
				<button on:click={(e) => addExercise(e, day, i)}>Add Exercise</button>
			</div>
		</div>
	{/each}

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
