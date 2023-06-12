<script lang="ts">
	import type { CustomQuery } from '@prisma/client';
	import Form from './Form.svelte';
	import TextField from './fields/TextField.svelte';
	import SelectField from './fields/SelectField.svelte';
	import { customQuerySchema } from '$lib/customQuery';
	import { v4 as uuidv4 } from 'uuid';

	// Form action to execute
	export let action = '';
	export let data: CustomQuery | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = uuidv4();
	export let showSubmitButton = true;
	export let showOperator = true;
</script>

<Form schema={customQuerySchema} {data} {action} {id} {onSuccess} resetForm={true} let:form>
	<TextField name="name" field="name" {form} />

	<SelectField name="table" field="table" {form}>
		<option value="exerciseEvent">Exercise Events</option>
		<option value="metric"> Metrics </option>
	</SelectField>

	{#if showOperator}
		<SelectField name="operator" field="operator" {form}>
			<option value="AND"> AND </option>
			<option value="OR">OR </option>
		</SelectField>
	{/if}

	{#if showSubmitButton}
		<button class="btn btn-primary btn-sm variant-filled">Submit</button>
	{/if}
</Form>
