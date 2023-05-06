<script lang="ts">
	import { page } from '$app/stores';
	import { chartSchema, type ChartSchema } from '$lib/chart';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import TextField from './TextField.svelte';
	import SelectField from './SelectField.svelte';
	import type { Chart } from '@prisma/client';
	import { assignDefined } from '$lib/utils';
	import type { z } from 'zod';

	export let data: Chart | undefined = undefined;
	export let action = '?/newExerciseEvent';
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => Promise<void>) | undefined = undefined;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData: z.infer<ChartSchema> = assignDefined(defaultData(chartSchema), data || {});
	const newSuperForm = superForm(formData, {
		resetForm: true,
		id,
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { enhance } = newSuperForm;
</script>

<form method="POST" use:enhance {action} {id}>
	<input type="hidden" name="_formId" value={id} />

	<TextField name="name" form={newSuperForm} field="name" placeholder={'Pull-ups volume'} />

	<SelectField name="type" form={newSuperForm} field="type">
		<option value="line"> Line Graph </option>
		<option value="bar"> Bar Graph </option>
		<option value="heatmap"> Heatmap </option>
	</SelectField>

	<SelectField name="matchAgainst" form={newSuperForm} field="matchAgainst">
		<option value="metrics"> Metrics </option>
		<option value="exerciseEvents"> Exercise Events </option>
	</SelectField>

	<br />
	<span class="text-gray-400"
		>This is a case insensitive <a
			href="https://github.com/ziishaned/learn-regex/blob/master/README.md">Regex</a
		>
		pattern that will check against exercise event names and other metric names.
		<br />
		For simple matching just enter the desired name such as "pull-ups".
	</span>
	<br />
	<TextField
		name="patternToMatch"
		form={newSuperForm}
		field="patternToMatch"
		placeholder={'pull-ups'}
	/>
	<br />

	<label class="font-bold" for="equation">Equation</label>
	<br />
	<span class="text-gray-400">
		This is a simple match equation where each attribute of an exercise event is given as a
		variable.
		<br />
		For <i>Exercise Events</i> they are: sets, reps, weight, minutes, seconds
		<br />
		For <i>Metrics</i> they are: value
		<br />
		For example, a valid equation when matching against exercise events might be: sets*reps*weight
	</span>
	<br />
	<TextField name="equation" form={newSuperForm} field="equation" placeholder={'sets*reps'} />
	<br />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</form>
