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
	<h1>
		{trainingProgram.name}
	</h1>

	<div>
		{#each trainingProgram.days as day, i}
			<div class="pb-4">
				<h2>
					<b>{daysOfTheWeek[i]}</b>
				</h2>

				<div class="pl-3">
					<div class="pb-3">
						<h3 class="inline">Description</h3>
						<a
							href={`/trainingProgramDay/${day.id}/edit?redirectTo=/trainingProgram/${$page.params.id}`}
							class="inline">Edit</a
						>
						<hr class="pb-2" />

						{#if day.description}
							<span>{day.description}</span>
						{:else}
							<p class="text-gray-400"><i>No description for this day</i></p>
						{/if}

						<br />
					</div>

					<h3>Exercises</h3>

					<hr class="pb-2" />

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
									<td>
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
