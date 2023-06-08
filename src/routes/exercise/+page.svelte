<script lang="ts">
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
	$: exercises = data.exercises;
</script>

<div class="flex justify-between mb-4">
	<div>
		<h1>Exercises</h1>
	</div>
	<div>
		<button
			class="btn btn-sm variant-filled mb-2"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: 'formModalExercise',
					meta: {
						action: `/exercise?/new`,
						title: 'New Exercise'
					}
				})}
		>
			<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
			<span>New Exercise</span>
		</button>
	</div>
</div>

<ul class="list">
	{#each exercises as exercise}
		<li class="card bg-white py-3 px-2 md:px-4 mb-2">
			<div class="flex items-center md:space-x-3">
				<div class="flex-1 min-w-0">
					<p>{exercise.name}</p>
				</div>
				<div class="flex min-w-0 float-right space-x-2">
					<slot name="buttons" {exercise}>
						<button
							class="btn btn-sm variant-ringed"
							on:click={() =>
								modalStore.trigger({
									type: 'component',
									component: 'formModalExercise',
									meta: {
										data: exercise,
										action: `/exercise/${exercise.id}?/edit`,
										title: 'Edit Exercise'
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
							action={`/exercise/${exercise.id}?/delete`}
						>
							<button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
								<Icon icon="mdi:trash-outline" height="18" />
								<span class="ml-1 mr-1"> Delete </span>
							</button>
						</form>
					</slot>
				</div>
			</div>
		</li>
	{/each}
</ul>
{#if exercises.length == 0}
	<span class="italic text-gray-400">No exercises</span>
{/if}
