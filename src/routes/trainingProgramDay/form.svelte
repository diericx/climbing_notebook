<script lang="ts">
	import type { TrainingProgramDayFormData } from '$lib/trainingProgramDay';

	export let trainingProgramDayFormData: TrainingProgramDayFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/newTrainingProgramDay';
	export let redirectTo: string = '';
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="description">Description</label>
	<br />
	<input
		name="description"
		placeholder="Rest day"
		bind:value={trainingProgramDayFormData.description}
		style="min-width: 150px"
	/>
	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
