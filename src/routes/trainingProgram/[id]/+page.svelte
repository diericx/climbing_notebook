<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import ExerciseEventForm from '../../exerciseEvent/minimalInlineForm.svelte';

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
					<div class="pb-3">
						<h3>Description</h3>
						<hr class="pb-2" />

						{#if day.description}
							<span>{day.description}</span>
						{:else}
							<p class="text-gray-400"><i>No description for this day</i></p>
						{/if}

						<br />
						<a
							href={`/trainingProgramDay/${day.id}/edit?redirectTo=/trainingProgram/${$page.params.id}`}
							>Edit</a
						>
					</div>

					<h3>Exercises</h3>

					<hr class="pb-2" />

					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Weight</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
							{#each day.exercises as exercise, j}
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
