<script lang="ts">
	import { page } from '$app/stores';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import type { TrainingProgram } from '@prisma/client';
	import { assignDefined } from '$lib/utils';
	import { trainingProgramSchema, type TrainingProgramSchema } from '$lib/trainingProgram';
	import TextField from './TextField.svelte';
	import type { z } from 'zod';

	// Form action to execute
	export let action = '/trainingProgram?/newTrainingProgram';
	export let data: TrainingProgram | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData: z.infer<TrainingProgramSchema> = assignDefined(
		defaultData(trainingProgramSchema),
		data || {}
	);
	const newSuperForm = superForm<TrainingProgramSchema>(formData, {
		resetForm: true,
		dataType: 'json',
		id,
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { enhance } = newSuperForm;
</script>

<form method="POST" {action} use:enhance {id}>
	<input type="hidden" name="_formId" value={id} />

	<input type="hidden" name="type" value="climbing" />

	<TextField name="name" field="name" form={newSuperForm} />

	<br />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</form>
