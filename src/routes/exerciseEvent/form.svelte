<script lang="ts">
	import dayjs from 'dayjs';
	import type { ExerciseEventFormData } from '$lib/exerciseEvent';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';

	export let exerciseEventFormData: ExerciseEventFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';

	let dateString = dayjs(new Date()).format('YYYY-MM-DD');
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />
	<input
		type="hidden"
		name="trainingProgramDayId"
		value={exerciseEventFormData.trainingProgramDayId}
	/>

	<div class="grid grid-cols-1 sm:grid-cols-4">
		{#if exerciseEventFormData.trainingProgramDayId}
			<div>
				<label for="date">Date</label>
				<br />
				<input type="date" name="date" bind:value={dateString} style="width: 150px" />
			</div>
		{/if}

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

		<div>
			<label for="weight">Weight</label>
			<br />
			<input
				type="number"
				name="weight"
				style="width: 150px"
				bind:value={exerciseEventFormData.weight}
			/>
		</div>

		{#if !exerciseEventFormData.trainingProgramDayId}
			<div>
				<label for="difficulty">Difficulty</label>
				<br />
				<input
					type="number"
					name="difficulty"
					style="width: 150px"
					bind:value={exerciseEventFormData.difficulty}
				/>
			</div>
		{/if}

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
	</div>

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
