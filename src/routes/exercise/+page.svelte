<script lang="ts">
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: exercises = data.exercises;
	$: user = data.user;

	let searchText = '';
</script>

<div class="flex justify-between mb-4">
	<div>
		<h1>Exercises</h1>
	</div>
	<div>
		<a class="btn btn-sm variant-filled mb-2" href="/exercise/new">
			<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
			<span>New Exercise</span>
		</a>
	</div>
</div>

<label class="label">
	<input class="w-full" type="text" placeholder="Search" bind:value={searchText} />
</label>

<ul class="list">
	{#each exercises.filter((e) => e.name
			.toLowerCase()
			.includes(searchText.toLowerCase())) as exercise}
		<li class="card bg-white py-3 px-2 md:px-4 mb-2">
			<div class="flex items-center md:space-x-3">
				<div class="flex-1 min-w-0">
					<p>{exercise.name}</p>
					<p class="text-gray-400">
						Used {exercise._count.exerciseEvents} times
					</p>
				</div>
				<div class="flex min-w-0 float-right space-x-2">
					<slot name="buttons" {exercise}>
						<a class="btn btn-sm variant-ringed" href={`/exercise/${exercise.id}/edit`}>
							<Icon icon="material-symbols:edit-outline" height="18" />
							<span>Edit</span>
						</a>
						{#if user.userId == exercise.createdByAuthUserId}
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
						{/if}
					</slot>
				</div>
			</div>
		</li>
	{/each}
</ul>
{#if exercises.length == 0}
	<span class="italic text-gray-400">No exercises</span>
{/if}
