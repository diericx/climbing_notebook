<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ExerciseEvent } from '@prisma/client';
	import { modalStore } from '@skeletonlabs/skeleton';

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
		{#if exerciseEvent.notes}
			<div>{exerciseEvent.notes}</div>
		{/if}

		<div class="pt-1">
			<button
				class="btn btn-sm variant-filled-primary bg-green-500 py-0 text-white"
				disabled={isMarkedCompleted}
				on:click={() =>
					modalStore.trigger({
						type: 'component',
						component: 'formModalExerciseEvent',
						meta: {
							// remove gropu id and program id so this will be considered an exercise event
							data: { ...exerciseEvent, exerciseGroupId: null, trainingProgramDayId: null },
							action: `/exerciseEvent?/new`,
							title: 'Complete Exercise',
							exerciseToMarkCompleted: exerciseEvent,
							dateToMarkCompleted: date
						}
					})}
			>
				<span>Complete</span>
			</button>
		</div>
	</div>
</div>
