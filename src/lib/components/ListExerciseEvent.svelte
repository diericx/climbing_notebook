<script lang="ts">
	import type { ExerciseEvent } from '@prisma/client';
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import ModalExerciseEvent from '$lib/components/modals/ModalExerciseEvent.svelte';
	import Icon from '@iconify/svelte';

	export let exerciseEvents: ExerciseEvent[];
	export let shouldShowDate = true;

	let exerciseEventModalProps = {
		action: '',
		exerciseEvent: undefined
	};
	let isExerciseEventModalVisible = false;
</script>

<ul class="divide-y divide-gray-200 border-t">
	{#each exerciseEvents as exerciseEvent}
		<li class="bg-white py-2">
			<div class="flex items-center md:space-x-3">
				<div class="mr-2">
					<Icon icon="healthicons:exercise-weights" width="35" />
				</div>
				{#if shouldShowDate}
					<div class="flex-initial hidden md:block">
						{new Date(exerciseEvent.date || '').toLocaleDateString('en-US')}
					</div>
				{/if}

				<div class="flex-1 min-w-0">
					<p>{exerciseEvent.name}</p>
					<p class="text-sm text-gray-400">
						{#if shouldShowDate}
							<span class="md:hidden">
								{new Date(exerciseEvent.date || '').toLocaleDateString('en-US')}
								<br />
							</span>
						{/if}
						{exerciseEvent.sets}x{exerciseEvent.reps} :
						{exerciseEvent.minutes}m{exerciseEvent.seconds}s : {exerciseEvent.weight}kg
						{#if exerciseEvent.difficulty}
							: {exerciseEvent.difficulty}
							difficulty
						{/if}
					</p>
				</div>
				<div class="flex min-w-0 float-right">
					<slot name="buttons" {exerciseEvent}>
						<ModalExerciseEvent
							action={`/exerciseEvent/${exerciseEvent.id}/edit?/editExerciseEvent`}
							data={exerciseEvent}
							let:showModal
						>
							<div slot="open-modal-buttons" class="inline">
								<button class="icon-button" on:click={showModal}>
									<Icon icon="material-symbols:edit-outline" height="18" />
									<span class="ml-1 mr-1"> Edit {exerciseEvent.id} </span>
								</button>
							</div>
						</ModalExerciseEvent>
						<form
							class="inline"
							use:enhance
							method="POST"
							action={`/exerciseEvent/${exerciseEvent.id}/edit?/deleteExerciseEvent`}
						>
							<button on:click={confirmDelete} class="icon-button" type="submit">
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
