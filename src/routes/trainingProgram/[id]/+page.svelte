<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { page } from '$app/stores';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import ExerciseEventForm from '../../exerciseEvent/minimalInlineForm.svelte';
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

					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Weight</th>
								<th>Notes</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{#each day.exercises as exercise}
								<tr>
									<td>
										{exercise.name}
									</td>
									<td>
										{exercise.weight}
									</td>
									<td>
										{exercise.notes}
									</td>
									<td class="float-right">
										<a
											href={`/exerciseEvent/${exercise.id}/edit?redirectTo=/trainingProgram/${trainingProgram.id}`}
											>Edit</a
										>
										<form method="POST" action={`/exerciseEvent?/delete`} class="inline">
											<input type="hidden" name="id" value={exercise.id} />
											<input
												type="hidden"
												name="redirectTo"
												value={`/trainingProgram/${trainingProgram.id}`}
											/>
											<button on:click={confirmDelete}>Delete</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>

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
