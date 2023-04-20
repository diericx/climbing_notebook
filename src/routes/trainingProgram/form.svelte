<script lang="ts">
	import { TrainingProgramFormData } from '$lib/trainingProgram';
	import type { TrainingProgram } from '@prisma/client';
	import { page } from '$app/stores';

	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action = '?/newTrainingProgram';

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	export let trainingProgram: TrainingProgram | undefined = undefined;
	export let trainingProgramFormData: TrainingProgramFormData = new TrainingProgramFormData();
	if (trainingProgram != undefined) {
		trainingProgramFormData = new TrainingProgramFormData(trainingProgram);
	}
</script>

<form method="POST" {action}>
	{#if trainingProgram != undefined}
		<input type="hidden" name="id" value={trainingProgram.id} />
	{/if}

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
