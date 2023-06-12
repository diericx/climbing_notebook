<script lang="ts">
	import type { ExerciseGroup } from '@prisma/client';
	import { exerciseGroupSchema } from '$lib/exerciseGroup';
	import TextField from './fields/TextField.svelte';
	import Form from './Form.svelte';
	import { v4 as uuidv4 } from 'uuid';

	// Form action to execute
	export let action = '';
	export let data: ExerciseGroup | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = uuidv4();
	export let showSubmitButton = true;
</script>

<Form schema={exerciseGroupSchema} bind:data {action} {id} {onSuccess} let:form>
	<input type="hidden" name="type" value="climbing" />

	<TextField name="name" field="name" {form} />

	<br />

	{#if showSubmitButton}
		<button class="btn btn-sm variant-filled">Submit</button>
	{/if}
</Form>
