<script lang="ts">
	import type { CustomQuery } from '@prisma/client';
	import Form from './Form.svelte';
	import SelectField from './fields/SelectField.svelte';
	import { widgetSchema } from '$lib/widget';
	import NumberField from './fields/NumberField.svelte';
	import TextField from './fields/TextField.svelte';

	// Form action to execute
	export let action = '';
	export let data: CustomQuery | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let showType = true;
	export let showOrder = true;
</script>

<Form schema={widgetSchema} {data} {action} {id} {onSuccess} resetForm={true} let:form>
	<TextField name="name" field="name" {form} />
	{#if showOrder}
		<NumberField name="order" field="order" {form} />
	{/if}
	<SelectField name="width" field="width" {form}>
		<option value="full">Full</option>
		<option value="half">Half</option>
	</SelectField>

	{#if showType}
		<SelectField name="type" field="type" {form}>
			<option value="chart"> Chart </option>
			<option value="calendar"> Full Calendar </option>
			<option value="heatmapCalendar"> Heatmap Calendar </option>
		</SelectField>
	{/if}

	{#if showSubmitButton}
		<button class="btn btn-primary btn-sm variant-filled">Submit</button>
	{/if}
</Form>
