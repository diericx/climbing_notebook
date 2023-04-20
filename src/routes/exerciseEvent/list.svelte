<script lang="ts">
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import type { ExerciseEvent } from '@prisma/client';

	export let redirectTo = '/exerciseEvent';
	export let exerciseEvents: ExerciseEvent[];
</script>

<ul class="divide-y divide-gray-200 border-t border-r border-l shadow">
	{#each exerciseEvents as exerciseEvent}
		<li class="bg-white py-2 px-6">
			<div class="flex items-center md:space-x-8">
				<div class="flex-initial hidden md:block">
					{new Date(exerciseEvent.date).toLocaleDateString('en-US')}
				</div>
				<div class="flex-1 min-w-0">
					<p>{exerciseEvent.name}</p>
					<p class="text-sm text-gray-400">
						<span class="md:hidden">
							{new Date(exerciseEvent.date).toLocaleDateString('en-US')}
							<br />
						</span>
						{exerciseEvent.sets}x{exerciseEvent.reps} :
						{exerciseEvent.minutes}m{exerciseEvent.seconds} : {exerciseEvent.weight}kg : {exerciseEvent.difficulty}
						difficulty
					</p>
				</div>
				<div class="flex min-w-0 float-right space-x-2">
					<form
						method="POST"
						action={`/exerciseEvent/${exerciseEvent.id}/edit?/deleteExerciseEvent`}
						use:enhance
					>
						<input type="hidden" name="id" value={exerciseEvent.id} />
						<button on:click={confirmDelete}>Delete</button>
					</form>
					<a href={`/exerciseEvent/${exerciseEvent.id}/edit?redirectTo=${redirectTo}`}>Edit</a>
				</div>
			</div>
		</li>
	{/each}
</ul>
