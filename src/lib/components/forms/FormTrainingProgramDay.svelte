<script lang="ts">
	import { page } from '$app/stores';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import type { TrainingProgramDay } from '@prisma/client';
	import { assignDefined } from '$lib/utils';
	import TextField from './TextField.svelte';
	import { trainingProgramDaySchema, type TrainingProgramDaySchema } from '$lib/trainingProgramDay';

	// Form action to execute
	export let action = '';
	export let data: TrainingProgramDay | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let applyDefaults = false;
	export let showSubmitButton = true;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData = data;
	if (applyDefaults) {
		data = assignDefined(defaultData(trainingProgramDaySchema), data || {});
	}
	const newSuperForm = superForm<TrainingProgramDaySchema>(formData, {
		resetForm: true,
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { enhance } = newSuperForm;
</script>

<form method="POST" {action} use:enhance {id}>
	<input type="hidden" name="type" value="climbing" />

	<TextField name="description" field="description" form={newSuperForm} />

	<br />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</form>
