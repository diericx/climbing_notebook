<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ExerciseEvent } from '@prisma/client';
	import ModalExerciseEvent from '$lib/components/modals/ModalExerciseEvent.svelte';

	export let exercise: ExerciseEvent;
	export let date: Date;

	$: isMarkedCompleted =
		exercise.markedCompletions.find((c) => {
			let d1 = c.toISOString().split('T')[0];
			let d2 = date.toISOString().split('T')[0];
			return d1 == d2;
		}) != undefined;

	let formForIsMarkedCompleted;
</script>

<div
	class="col rounded-md border p-2 mb-2 leading-5 bg-white {isMarkedCompleted ? 'opacity-50' : ''}"
>
	<div class="flex items-center">
		<form
			method="POST"
			bind:this={formForIsMarkedCompleted}
			action={`/exerciseEvent/${exercise.id}/edit?/setCompleted`}
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
		>
			<input type="hidden" name="date" value={date} />
			<input
				type="checkbox"
				name="isCompleted"
				checked={isMarkedCompleted}
				on:change={() => {
					formForIsMarkedCompleted.requestSubmit();
					// Update the UI now, changes/truth will be updated once the form
					// submission result is back
					isMarkedCompleted = !isMarkedCompleted;
				}}
				class="w-4 h-4 mr-2 rounded-full border-gray-400 text-green-600 disabled:text-green-300 focus:ring-red-200"
			/>
		</form>
		{exercise.name}
	</div>
	<div class="mt-1 text-sm text-gray-500">
		<div>
			{#if exercise.sets != 0 || exercise.reps != 0}
				{exercise.sets}x{exercise.reps}
			{/if}
			{#if exercise.minutes != 0 || exercise.seconds != 0}
				: {exercise.minutes}m{exercise.seconds}s
			{/if}
			{#if exercise.weight != 0}
				: {exercise.weight}kg
			{/if}
		</div>
		{#if exercise.notes != ''}
			<div>{exercise.notes}</div>
		{/if}

		<div class="pt-1">
			<ModalExerciseEvent
				action="/exerciseEvent?/newExerciseEvent"
				title="Complete Exercise"
				let:changeShowModal
				exerciseEvent={exercise}
				exerciseToMarkCompleted={exercise}
				dateToMarkCompleted={date}
				showDate
				showDifficulty
			>
				<div slot="open-modal-buttons">
					<button
						class="icon-button text-white py-0 m-0 border-0 bg-green-300 {isMarkedCompleted
							? 'hover:bg-green-300'
							: 'hover:bg-green-400'}"
						disabled={isMarkedCompleted}
						on:click={() => changeShowModal(true)}
					>
						<span class="ml-1 mr-1">Complete </span>
					</button>
				</div>
			</ModalExerciseEvent>
		</div>
	</div>
</div>
