<script lang="ts">
	import type { TrainingProgramFormData } from '$lib/trainingProgram';

	export let trainingProgramFormData: TrainingProgramFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/newTrainingProgram';
	export let redirectTo: string = '';
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />
	<input type="hidden" name="id" value={trainingProgramFormData._id} />

	<label for="name">Name</label>
	<br />
	<input
		name="name"
		placeholder="Upper body + hang board"
		bind:value={trainingProgramFormData.name}
		style="min-width: 300px"
	/>
	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
