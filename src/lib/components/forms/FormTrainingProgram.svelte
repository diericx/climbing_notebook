<script lang="ts">
	import type { TrainingProgram } from '@prisma/client';
	import { trainingProgramSchema } from '$lib/trainingProgram';
	import TextField from './fields/TextField.svelte';
	import Form from './Form.svelte';
	import Checkbox from './fields/Checkbox.svelte';

	// Form action to execute
	export let action = '';
	export let data: TrainingProgram | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
</script>

<Form schema={trainingProgramSchema} bind:data {action} {id} {onSuccess} let:form>
	<input type="hidden" name="type" value="climbing" />

	<TextField name="name" field="name" {form} />
	<Checkbox name="isPublic" field="isPublic" {form} />

	<br />

	{#if showSubmitButton}
		<button class="btn btn-sm variant-filled">Submit</button>
	{/if}
</Form>
