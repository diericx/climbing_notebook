<script lang="ts">
	import { journalEntrySchema } from '$lib/journalEntry';
	import { fontGrades, gradeSystems, huecoGrades } from '$lib/utils';
	import type { Project } from '@prisma/client';
	import Checkbox from './fields/Checkbox.svelte';
	import DateField from './fields/DateField.svelte';
	import TextArea from './fields/TextArea.svelte';
	import Form from './Form.svelte';

	// Form action to execute
	export let action = '';
	export let data: Project | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
</script>

<Form
	schema={journalEntrySchema}
	{data}
	{action}
	{id}
	{onSuccess}
	resetForm={true}
	let:form
	let:formData
>
	<input type="hidden" name="_formId" value={id} />
	<Checkbox name="sent" field="sent" {form} />
	<DateField name="date" field="date" {form} />
	<TextArea name="notes" field="notes" {form} />

	{#if showSubmitButton}
		<button class="btn btn-primary btn-sm variant-filled">Submit</button>
	{/if}
</Form>
