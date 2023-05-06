<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ExerciseEvent } from '@prisma/client';
	import ModalExerciseEvent from '$lib/components/modals/ModalExerciseEvent.svelte';

	export let exerciseEvent: ExerciseEvent;
	export let date: Date;

	$: isMarkedCompleted =
		exerciseEvent.markedCompletions.find((c) => {
			let d1 = c.toISOString().split('T')[0];
			let d2 = date.toISOString().split('T')[0];
			return d1 == d2;
		}) != undefined;

	let formForIsMarkedCompleted: HTMLElement;
</script>

<div
	class="col rounded-md border p-2 mb-2 leading-5 bg-white {isMarkedCompleted ? 'opacity-50' : ''}"
>
	<div class="flex items-center">
		<form
			method="POST"
			bind:this={formForIsMarkedCompleted}
			action={`/exerciseEvent/${exerciseEvent.id}/edit?/setCompleted`}
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
		{exerciseEvent.name}
	</div>
	<div class="mt-1 text-sm text-gray-500">
		<div>
			{#if exerciseEvent.sets != 0 || exerciseEvent.reps != 0}
				{exerciseEvent.sets}x{exerciseEvent.reps}
			{/if}
			{#if exerciseEvent.minutes != 0 || exerciseEvent.seconds != 0}
				: {exerciseEvent.minutes}m{exerciseEvent.seconds}s
			{/if}
			{#if exerciseEvent.weight != 0}
				: {exerciseEvent.weight}kg
			{/if}
		</div>
		{#if exerciseEvent.notes != ''}
			<div>{exerciseEvent.notes}</div>
		{/if}

		<div class="pt-1">
			<ModalExerciseEvent
				data={exerciseEvent}
				action="/exerciseEvent?/newExerciseEvent"
				title="Complete Exercise"
				let:changeShowModal
				exerciseToMarkCompleted={exerciseEvent}
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
						<span class="ml-1 mr-1">Complete</span>
					</button>
				</div>
			</ModalExerciseEvent>
		</div>
	</div>
</div>
