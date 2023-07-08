<script lang="ts">
	import type { CustomQuery } from '@prisma/client';
	import Form from './Form.svelte';
	import TextField from './fields/TextField.svelte';
	import SelectField from './fields/SelectField.svelte';
	import { customQueryConditionSchema } from '$lib/customQuery';
	import { v4 as uuidv4 } from 'uuid';

	// Form action to execute
	export let action = '';
	export let data: CustomQuery | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = uuidv4();
	export let showSubmitButton = true;
	export let query: CustomQuery;
	console.log(query);
</script>

<Form
	schema={customQueryConditionSchema}
	{data}
	{action}
	{id}
	{onSuccess}
	resetForm={true}
	let:form
>
	{#if query.table == 'exerciseEvent'}
		<SelectField name="column" field="column" {form}>
			<option value="name">Name</option>
			<option value="notes"> Notes </option>
		</SelectField>
	{:else if query.table == 'metric'}
		<SelectField name="column" field="column" {form}>
			<option value="name">Name</option>
		</SelectField>
	{/if}

	<SelectField name="condition" field="condition" {form}>
		<option value="equals"> Equals </option>
		<option value="contains"> Contains </option>
	</SelectField>

	<TextField name="value" field="value" {form} />

	{#if showSubmitButton}
		<button class="btn btn-primary btn-sm variant-filled">Submit</button>
	{/if}
</Form>
