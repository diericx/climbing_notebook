<script lang="ts">
	import { journalEntrySchema } from '$lib/journalEntry';
	import { fontGrades, gradeSystems, huecoGrades } from '$lib/utils';
	import type { Project } from '@prisma/client';
	import SelectField from './fields/SelectField.svelte';
	import TextField from './fields/TextField.svelte';
	import Form from './Form.svelte';

	// Form action to execute
	export let action = '/project?/new';
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
	<TextField name="name" field="name" {form} placeholder={'Alphane'} />
	<SelectField name="gradeSystem" field="gradeSystem" {form}>
		{#each gradeSystems as gradeSystem}
			<option value={gradeSystem}>{gradeSystem}</option>
		{/each}
	</SelectField>
	{#if formData?.gradeSystem == 'font'}
		<SelectField name="fontGrade" field="fontGrade" {form}>
			{#each fontGrades as grade}
				<option value={grade}>{grade}</option>
			{/each}
		</SelectField>
	{:else if formData?.gradeSystem == 'hueco'}
		<SelectField name="huecoGrade" field="huecoGrade" {form}>
			{#each huecoGrades as grade}
				<option value={grade}>{grade}</option>
			{/each}
		</SelectField>
	{/if}
	<TextField name="url" field="url" {form} />

	{#if showSubmitButton}
		<button class="btn btn-primary btn-sm variant-filled">Submit</button>
	{/if}
</Form>
