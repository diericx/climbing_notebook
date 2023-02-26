<script lang="ts">
	import type { TrainingProgramWithDays } from '$lib/prisma';

	export let trainingProgram: TrainingProgramWithDays;

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
						<p>- {exercise.name}</p>
					{/each}
				</td>
			{/each}
		</tr>
	</tbody>
</table>
