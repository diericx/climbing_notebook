<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { page } from '$app/stores';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import ExerciseEventForm from '../../exerciseEvent/minimalInlineForm.svelte';
	import ExerciseEventsList from '../../exerciseEvent/list.svelte';
	import { confirmDelete } from '$lib/utils';

	export let data: PageData;
	export let form: ActionData;

	const { trainingProgram } = data;

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

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<h1>Edit Training Program</h1>
	<hr />

	<div>
		<b>Name: </b>
		{trainingProgram.name}
		<br />
		{#each trainingProgram.days as day, i}
			<div class="pt-6">
				<h2>
					<b>{daysOfTheWeek[i]}</b>
				</h2>
				<hr />

				<div class="pl-3">
					<div class="pb-3">
						<h3 class="inline"><b>Description:</b></h3>
						{#if day.description}
							<span>{day.description}</span>
							<br />
						{:else}
							<p class="text-gray-400"><i>No description for this day</i></p>
						{/if}
						<a
							href={`/trainingProgramDay/${day.id}/edit?redirectTo=/trainingProgram/${$page.params.id}`}
							class="">Edit Description</a
						>

						<br />
					</div>

					<h3><b>Exercises:</b></h3>

					<ExerciseEventsList
						exerciseEvents={day.exercises}
						redirectTo={`/trainingProgram/${$page.params.id}`}
						showDate={false}
						showDifficulty={false}
					/>

					<ExerciseEventForm
						action="/exerciseEvent?/new"
						redirectTo={`/trainingProgram/${$page.params.id}`}
						submitLabel="Add Exercise"
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
