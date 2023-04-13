<script lang="ts">
	import dayjs from 'dayjs';
	import type { ExerciseEventFormData } from '$lib/exerciseEvent';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import { enhance } from '$app/forms';

	export let exerciseEventFormData: ExerciseEventFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/newExerciseEvent';
	export let redirectTo: string = '';

	let dateString = dayjs(new Date()).format('YYYY-MM-DD');
</script>

<form method="POST" {action} use:enhance>
	<input type="hidden" name="redirectTo" value={redirectTo} />
	<input
		type="hidden"
		name="trainingProgramDayId"
		value={exerciseEventFormData.trainingProgramDayId}
	/>
	<div class="flex">
		<!-- When connected to a training program, it is simply a template so no date -->
		<!-- This if tpid is not set, show date -->
		{#if !exerciseEventFormData.trainingProgramDayId}
			<div>
				<label for="date">Date</label>
				<br />
				<input type="date" name="date" bind:value={dateString} style="width: 150px" />
			</div>
		{/if}
	</div>
	<div>
		<label for="name">Name</label>
		<br />
		<input
			name="name"
			placeholder="Pull-Ups 3x7"
			bind:value={exerciseEventFormData.name}
			style="width: 150px"
		/>
	</div>

	<div class="flex gap-2">
		<div>
			<label for="sets">Sets</label>
			<br />
			<input
				type="number"
				style="width: 75px"
				name="sets"
				bind:value={exerciseEventFormData.sets}
			/>
		</div>

		<div class="inline">
			<label for="reps">Reps</label>
			<br />
			<input
				type="number"
				style="width: 75px"
				name="reps"
				bind:value={exerciseEventFormData.reps}
			/>
		</div>

		<div>
			<label for="weight">Weight</label>
			<br />
			<input
				type="number"
				name="weight"
				style="width: 75px"
				bind:value={exerciseEventFormData.weight}
			/>
		</div>

		<!-- When connected to a training program, it is simply a template -->
		<!-- This if tpid is not set, show difficulty -->
		{#if !exerciseEventFormData.trainingProgramDayId}
			<div>
				<label for="difficulty">Difficulty</label>
				<br />
				<input
					type="number"
					name="difficulty"
					style="width: 75px"
					bind:value={exerciseEventFormData.difficulty}
				/>
			</div>
		{/if}
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
			bind:value={exerciseEventFormData.notes}
		/>
	</div>

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
