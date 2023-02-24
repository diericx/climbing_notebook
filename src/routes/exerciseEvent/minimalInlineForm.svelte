<script lang="ts">
	import type { ExerciseEventFormData } from '$lib/exerciseEvent';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';

	export let exerciseEventFormData: ExerciseEventFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />
	<input
		type="hidden"
		name="trainingProgramDayId"
		value={exerciseEventFormData.trainingProgramDayId}
	/>

	<div class="flex grid-cols-3">
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
			<br />
		</div>
		<div class="grow">
			<label for="notes">Notes</label>
			<br />
			<TabEnabledTextArea
				name="notes"
				rows="1"
				placeholder=""
				class="w-full"
				bind:value={exerciseEventFormData.notes}
			/>
		</div>
	</div>
	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
