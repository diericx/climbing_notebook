<script lang="ts">
	import type { TrainingProgramDay } from '@prisma/client';
	import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
	import Form from './Form.svelte';
	import TextField from './fields/TextField.svelte';

	// Form action to execute
	export let action = '';
	export let data: TrainingProgramDay | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
</script>

<Form schema={trainingProgramDaySchema} {data} {action} {id} {onSuccess} let:form>
	<input type="hidden" name="type" value="climbing" />

	<TextField name="description" field="description" {form} />

	<br />

	{#if showSubmitButton}
		<button class="btn btn-sm variant-filled">Submit</button>
	{/if}
</Form>
