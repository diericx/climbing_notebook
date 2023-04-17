<script lang="ts">
	import type { TrainingProgramWithDays } from '$lib/prisma';
	import type { ExerciseEvent } from '@prisma/client';

	export let trainingProgram: TrainingProgramWithDays;
	export let showFillButton = false;
	export let fillBelowFunc = () => {};
	export let isExerciseCompleted = (e: ExerciseEvent) => {
		return false;
	};

	let daysOfTheWeek = ['M', 'T', 'W', 'TH', 'F', 'S', 'S'];
</script>

<table>
	<thead>
		<tr class="align-top">
			{#each trainingProgram.days as day, i}
				<th class="p-3">
					<p>{daysOfTheWeek[i]}</p>
					<p class="text-sm text-gray-400">{day.description}</p>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		<tr class="align-top text-sm">
			{#each trainingProgram.days as day}
				<td class="border p-1">
					{#each day.exercises as exercise}
						<p>
							{#if isExerciseCompleted(exercise)}
								✅
							{:else}
								☐
							{/if}
							{exercise.name}
							{#if showFillButton}
								<button class="float-right" on:click={() => fillBelowFunc(exercise)}
									>Fill Below</button
								>
							{/if}
						</p>
					{/each}
					{#each day.exerciseGroups as group}
						<p class="font-bold">{group.name}</p>
						{#each group.exercises as exercise}
							<p class="pl-2">
								{#if isExerciseCompleted(exercise)}
									✅
								{:else}
									☐
								{/if}
								{exercise.name}

								{#if showFillButton}
									<button class="float-right" on:click={() => fillBelowFunc(exercise)}
										>Fill Below</button
									>
								{/if}
							</p>
						{/each}
					{/each}
				</td>
			{/each}
		</tr>
	</tbody>
</table>
