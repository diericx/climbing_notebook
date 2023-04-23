<script lang="ts">
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import { page } from '$app/stores';
	import type { ExerciseEvent } from '@prisma/client';
	import DateInput from '$lib/components/dateInput.svelte';

	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action = '?/newExerciseEvent';

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	export let exerciseEvent: ExerciseEvent | undefined = undefined;
	export let exerciseEventFormData: ExerciseEventFormData = new ExerciseEventFormData();
	if (exerciseEvent != undefined) {
		exerciseEventFormData = new ExerciseEventFormData(exerciseEvent);
	}
</script>

<form method="POST" {action}>
	<div class="flex">
		<div>
			<label for="date">Date</label>
			<br />
			<DateInput name="date" date={exerciseEventFormData.date || new Date()} style="width: 150px" />
		</div>
	</div>
	<div>
		<label for="name">Name</label>
		<br />
		<input
			type="text"
			name="name"
			placeholder="Pull-Ups 3x7"
			value={exerciseEventFormData.name || ''}
			style="width: 150px"
		/>
	</div>

	<div class="flex flex-wrap gap-2">
		<div>
			<label for="sets">Sets</label>
			<br />
			<input
				type="number"
				style="width: 75px"
				name="sets"
				value={exerciseEventFormData.sets || 0}
			/>
		</div>

		<div>
			<label for="reps">Reps</label>
			<br />
			<input
				type="number"
				style="width: 75px"
				name="reps"
				value={exerciseEventFormData.reps || 0}
			/>
		</div>

		<div class="w-full md:hidden" />

		<div>
			<label for="minutes">Minutes</label>
			<br />
			<input
				type="number"
				name="minutes"
				style="width: 75px"
				value={exerciseEventFormData.minutes || 0}
			/>
		</div>

		<div>
			<label for="seconds">Seconds</label>
			<br />
			<input
				type="number"
				name="seconds"
				style="width: 75px"
				value={exerciseEventFormData.seconds || 0}
			/>
		</div>

		<div class="w-full md:hidden" />

		<div>
			<label for="weight">Weight</label>
			<br />
			<input
				type="number"
				step="0.1"
				name="weight"
				style="width: 75px"
				value={exerciseEventFormData.weight || 0}
			/>
		</div>

		<div>
			<label for="difficulty">Difficulty</label>
			<br />
			<input
				type="number"
				name="difficulty"
				style="width: 75px"
				value={exerciseEventFormData.difficulty || 0}
			/>
		</div>
	</div>

	<div class="sm:col-span-4">
		<label for="notes">Notes</label>
		<br />
		<TabEnabledTextArea
			name="notes"
			cols="40"
			rows="3"
			placeholder=""
			class="w-full"
			value={exerciseEventFormData.notes || ''}
		/>
	</div>

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
