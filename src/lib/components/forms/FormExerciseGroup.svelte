<script lang="ts">
	import type { ExerciseGroup } from '@prisma/client';
	import { exerciseGroupSchema } from '$lib/exerciseGroup';
	import TextField from './TextField.svelte';
	import Form from './Form.svelte';

	// Form action to execute
	export let action = '';
	export let data: ExerciseGroup | undefined = undefined;
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
</script>

<Form schema={exerciseGroupSchema} {data} {action} {id} {onSuccess} let:form>
	<input type="hidden" name="type" value="climbing" />

	<TextField name="name" field="name" {form} />

	<br />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</Form>
