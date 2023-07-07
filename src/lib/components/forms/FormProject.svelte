<script lang="ts">
	import { journalEntrySchema } from '$lib/journalEntry';
	import { fontGrades, gradeSystems, huecoGrades } from '$lib/utils';
	import type { Project } from '@prisma/client';
	import SelectField from './fields/SelectField.svelte';
	import TextField from './fields/TextField.svelte';
	import Form from './Form.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	// Form action to execute
	export let action = '/project?/new';
	export let data: Project | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = uuidv4();
	export let showSubmitButton = true;

	let files: FileList;
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
	let:errors
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

	<label for="file" class="font-bold"> Image </label>
	{#if errors.file}<span class="invalid">{errors.file}</span>{/if}
	<FileDropzone name="file" bind:files>
		<svelte:fragment slot="lead">
			{#if !files || files.length == 0}
				<div class="flex justify-center">
					<Icon icon="mingcute:file-upload-fill" height="50" />
				</div>
			{:else}
				<div class="flex justify-center">
					<Icon icon="bi:image" height="50" />
				</div>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="message">
			{#if !files || files.length == 0}
				<b>Upload an image </b> or drag and drop
			{:else}
				{files[0].name}
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="meta">
			{#if !files || files.length == 0}
				JPG and PNG allowed
			{/if}</svelte:fragment
		>
	</FileDropzone>

	{#if showSubmitButton}
		<button class="btn btn-primary btn-sm variant-filled">Submit</button>
	{/if}
</Form>
