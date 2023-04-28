<script lang="ts">
	import type { ExerciseGroupComplete } from '$lib/prisma';
	import Icon from '@iconify/svelte';

	export let exerciseGroups: ExerciseGroupComplete[];
</script>

<ul class="divide-y divide-gray-200 border-t border-r border-l shadow">
	{#each exerciseGroups as group}
		<li class="bg-white py-2 px-3">
			<div class="flex items-center md:space-x-3">
				<div class="mr-2">
					<Icon icon="material-symbols:list-alt" width="35" />
				</div>
				<div class="flex items-center md:space-x-8">
					<div class="flex-1 min-w-0">
						<p>{group.name}</p>
						{#each group.exercises as exercise}
							<p class="text-sm text-gray-400">
								- {exercise.name}
								{exercise.sets || 0}x{exercise.reps || 0}@{exercise.weight || 0}kg
							</p>
						{/each}
					</div>
				</div>
				<div class="flex-1" />
				<div class="flex min-w-0 float-right space-x-2">
					<slot name="buttons" {group} />
				</div>
			</div>
		</li>
	{/each}
</ul>
