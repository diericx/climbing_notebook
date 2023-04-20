<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ExerciseEvent } from '@prisma/client';

	export let exercise: ExerciseEvent;
	export let isExerciseCompleted;
	export let fillExerciseEventForm;
	export let shouldShowActionButtons = true;
</script>

<div
	class="col rounded-md border p-2 mb-2 leading-5 {isExerciseCompleted(exercise)
		? 'opacity-50 bg-green-200'
		: 'opacity-100 shadow bg-white'}"
>
	{exercise.name}
	<br />
	<div class="mt-1 text-sm text-gray-500">
		{#if exercise.sets != 0 || exercise.reps != 0}
			{exercise.sets}x{exercise.reps}
		{/if}
		{#if exercise.minutes != 0 || exercise.seconds != 0}
			: {exercise.minutes}m{exercise.seconds}s
		{/if}
		<br />
		{#if shouldShowActionButtons}
			<div class="pt-1">
				<button class="bg-sky-400 text-white" on:click={() => fillExerciseEventForm(exercise)}
					>Fill Form</button
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

					<button disabled={isExerciseCompleted(exercise)} class="bg-green-400 text-white"
						>Complete</button
					>
				</form>
			</div>
		{/if}
	</div>
</div>
