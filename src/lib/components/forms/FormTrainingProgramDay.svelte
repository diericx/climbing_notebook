<script lang="ts">
	import type { TrainingProgramDay } from '@prisma/client';
	import TextField from './TextField.svelte';
	import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
	import Form from './Form.svelte';

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
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</Form>
