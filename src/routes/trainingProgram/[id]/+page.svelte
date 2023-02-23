<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import ExerciseEventForm from '../../trainingLog/minimalInlineForm.svelte';

	export let data: PageData;

	let daysOfTheWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];
</script>

<div class="grid grid-cols-1">
	<h1>
		{data.trainingProgram.name}
	</h1>
	<div>
		{#each data.trainingProgram.days as day, i}
			<div class="pb-4">
				<h2>
					<b>{daysOfTheWeek[i]}</b>
				</h2>

				<div class="pl-3">
					<h3>Description</h3>
					<span>{day.description}</span>
					<hr />

					<h3>Exercises</h3>
					<hr />

					<br />
					{#each day.exercises as exercise, j}
						<div>
							{exercise.name}
						</div>
					{/each}

					<ExerciseEventForm
						action="/trainingLog?/new"
						redirectTo={`/trainingProgram/${$page.params.id}`}
						exerciseEventFormData={ExerciseEventFormData.fromObject({
							name: '',
							weight: 0,
							notes: '',
							trainingProgramDayId: day.id
						})}
					/>
				</div>
			</div>
		{/each}
	</div>
</div>
