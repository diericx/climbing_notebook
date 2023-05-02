<script lang="ts">
	import { TrainingProgramFormData } from '$lib/trainingProgram';
	import EnhancedForm from '$lib/components/enhancedForm.svelte';
	import type { TrainingProgram } from '@prisma/client';
	import { page } from '$app/stores';

	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action = '/trainingProgram?/newTrainingProgram';
	export let id = crypto.randomUUID();
	export let onSuccess: (() => void) | undefined = undefined;
	export let showButton = true;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	export let trainingProgram: TrainingProgram | undefined = undefined;
	export let formData: TrainingProgramFormData = new TrainingProgramFormData();
	if (trainingProgram != undefined) {
		formData = new TrainingProgramFormData(trainingProgram);
	}
</script>

<EnhancedForm {id} {action} {onSuccess}>
	{#if trainingProgram != undefined}
		<input type="hidden" name="id" value={trainingProgram.id} />
	{/if}

	<label for="name">Name</label>
	<br />
	<input
		type="text"
		name="name"
		placeholder="Upper body + hang board"
		bind:value={formData.name}
		style="min-width: 300px"
	/>
	<br />

	{#if showButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</EnhancedForm>
