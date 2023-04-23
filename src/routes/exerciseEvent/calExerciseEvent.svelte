<script lang="ts">
	import { enhance } from '$app/forms';
	import { isDateInTheSameWeekAsToday } from '$lib/utils';
	import type { ExerciseEvent } from '@prisma/client';

	export let exercise: ExerciseEvent;
	// An exercise is inferred as completed if a matching exercise event is found
	export let isInferredAsCompleted = false;
	export let fillExerciseEventFormFunc: (e: ExerciseEvent) => void;

	$: isMarkedCompleted =
		exercise.isMarkedCompleted && isDateInTheSameWeekAsToday(new Date(exercise.markedCompletedOn));

	let formForIsMarkedCompleted;
</script>

<div
	class="col rounded-md border p-2 mb-2 leading-5 {isInferredAsCompleted
		? 'opacity-50 bg-green-200'
		: 'opacity-100 shadow bg-white'}
		{isMarkedCompleted ? 'opacity-40 bg-green-300' : ''}"
>
	<div class="flex items-center">
		<form
			method="POST"
			bind:this={formForIsMarkedCompleted}
			action={`/exerciseEvent/${exercise.id}/edit?/editExerciseEvent`}
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
		>
			<input
				type="checkbox"
				name="isMarkedCompleted"
				checked={isInferredAsCompleted || isMarkedCompleted}
				disabled={isInferredAsCompleted}
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
	{#if isInferredAsCompleted}
		<div class="text-sm text-gray-400">Matching exercise found</div>
	{/if}
	<div class="mt-1 text-sm text-gray-500">
		{#if exercise.sets != 0 || exercise.reps != 0}
			{exercise.sets}x{exercise.reps}
		{/if}
		{#if exercise.minutes != 0 || exercise.seconds != 0}
			: {exercise.minutes}m{exercise.seconds}s
		{/if}
		<br />
		<div class="pt-1">
			<button class="bg-sky-400 text-white" on:click={() => fillExerciseEventFormFunc(exercise)}
				>Fill Form Below</button
			>
			<form
				method="POST"
				action="/exerciseEvent?/newExerciseEvent"
				class="inline float-right"
				use:enhance
			>
				<input type="hidden" name="name" value={exercise.name} />
				<input type="hidden" name="sets" value={exercise.sets} />
				<input type="hidden" name="reps" value={exercise.reps} />
				<input type="hidden" name="minutes" value={exercise.minutes} />
				<input type="hidden" name="seconds" value={exercise.seconds} />
				<input type="hidden" name="weight" value={exercise.weight} />
			</form>
		</div>
	</div>
</div>
