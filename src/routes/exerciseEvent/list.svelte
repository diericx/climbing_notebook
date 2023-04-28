<script lang="ts">
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import type { ExerciseEvent } from '@prisma/client';
	import Icon from '@iconify/svelte';

	export let redirectTo = '/exerciseEvent';
	export let exerciseEvents: ExerciseEvent[];
	export let shouldShowDate = true;
</script>

<ul class="divide-y divide-gray-200 border-t border-r border-l shadow">
	{#each exerciseEvents as exerciseEvent}
		<li class="bg-white py-2 px-3">
			<div class="flex items-center md:space-x-3">
				<div class="mr-2">
					<Icon icon="healthicons:exercise-weights" width="35" />
				</div>
				{#if shouldShowDate}
					<div class="flex-initial hidden md:block">
						{new Date(exerciseEvent.date).toLocaleDateString('en-US')}
					</div>
				{/if}

				<div class="flex-1 min-w-0">
					<p>{exerciseEvent.name}</p>
					<p class="text-sm text-gray-400">
						{#if shouldShowDate}
							<span class="md:hidden">
								{new Date(exerciseEvent.date).toLocaleDateString('en-US')}
								<br />
							</span>
						{/if}
						{exerciseEvent.sets}x{exerciseEvent.reps} :
						{exerciseEvent.minutes}m{exerciseEvent.seconds} : {exerciseEvent.weight}kg
						{#if exerciseEvent.difficulty}
							: {exerciseEvent.difficulty}
							difficulty
						{/if}
					</p>
				</div>
				<div class="flex min-w-0 float-right space-x-2">
					<slot name="buttons" {exerciseEvent}>
						<form
							method="POST"
							action={`/exerciseEvent/${exerciseEvent.id}/edit?/deleteExerciseEvent`}
							use:enhance
						>
							<input type="hidden" name="id" value={exerciseEvent.id} />
							<button on:click={confirmDelete}>Delete</button>
						</form>
						<a href={`/exerciseEvent/${exerciseEvent.id}/edit?redirectTo=${redirectTo}`}>Edit</a>
					</slot>
				</div>
			</div>
		</li>
	{/each}
</ul>
