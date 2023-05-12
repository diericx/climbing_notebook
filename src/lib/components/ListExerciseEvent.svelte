<script lang="ts">
	import type { ExerciseEvent } from '@prisma/client';
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let exerciseEvents: ExerciseEvent[];
	export let showDate = true;
	export let showDifficulty = true;
	export let showActionBtns = true;
</script>

<ul class="divide-y divide-gray-200 border">
	{#each exerciseEvents as exerciseEvent}
		<li class="bg-white py-2 px-2 md:px-4">
			<div class="flex items-center md:space-x-3">
				<div class="mr-2">
					<Icon icon="healthicons:exercise-weights" width="35" />
				</div>
				{#if showDate}
					<div class="flex-initial hidden md:block">
						{new Date(exerciseEvent.date || '').toLocaleDateString('en-US')}
					</div>
				{/if}

				<div class="flex-1 min-w-0">
					<p>{exerciseEvent.name}</p>
					<p class="text-sm text-gray-400">
						{#if showDate}
							<span class="md:hidden">
								{new Date(exerciseEvent.date || '').toLocaleDateString('en-US')}
								<br />
							</span>
						{/if}
						{exerciseEvent.sets}x{exerciseEvent.reps} :
						{exerciseEvent.minutes}m{exerciseEvent.seconds}s : {exerciseEvent.weight}kg
						{#if exerciseEvent.difficulty && showDifficulty}
							: {exerciseEvent.difficulty}
							difficulty
						{/if}
					</p>
				</div>
				<div class="flex min-w-0 float-right space-x-2">
					{#if showActionBtns}
						<slot name="buttons" {exerciseEvent}>
							<button
								class="btn btn-sm variant-ringed"
								on:click={() =>
									modalStore.trigger({
										type: 'component',
										component: 'formModalExerciseEvent',
										meta: {
											data: exerciseEvent,
											action: `/exerciseEvent/${exerciseEvent.id}?/edit`,
											title: 'Edit Exercise Event',
											showDate,
											showDifficulty
										}
									})}
							>
								<Icon icon="material-symbols:edit-outline" height="18" />
								<span>Edit</span>
							</button>
							<form
								class="inline"
								use:enhance
								method="POST"
								action={`/exerciseEvent/${exerciseEvent.id}?/delete`}
							>
								<button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
									<Icon icon="mdi:trash-outline" height="18" />
									<span class="ml-1 mr-1"> Delete </span>
								</button>
							</form>
						</slot>
					{/if}
				</div>
			</div>
		</li>
	{/each}
</ul>
{#if exerciseEvents.length == 0}
	<span class="italic text-gray-400">No exercises</span>
{/if}
