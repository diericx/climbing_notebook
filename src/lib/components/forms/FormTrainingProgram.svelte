<script lang="ts">
	import type { TrainingProgram } from '@prisma/client';
	import { trainingProgramSchema } from '$lib/trainingProgram';
	import TextField from './fields/TextField.svelte';
	import Form from './Form.svelte';

	// Form action to execute
	export let action = '/trainingProgram?/newTrainingProgram';
	export let data: TrainingProgram | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
</script>

<Form schema={trainingProgramSchema} bind:data {action} {id} {onSuccess} let:form>
	<input type="hidden" name="type" value="climbing" />

	<TextField name="name" field="name" {form} />

	<br />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</Form>
