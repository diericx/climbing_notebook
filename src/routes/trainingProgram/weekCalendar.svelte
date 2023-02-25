<script lang="ts">
	import type { TrainingProgram } from '@prisma/client';

	export let trainingProgram: TrainingProgram;

	let daysOfTheWeek = ['M', 'T', 'W', 'TH', 'F', 'S', 'S'];
</script>

<table>
	<thead>
		<tr class="align-top">
			{#each trainingProgram.days as day, i}
				<th>
					<p>{daysOfTheWeek[i]}</p>
					<p class="text-gray-400">{day.description}</p>
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
