<script lang="ts">
	import { chartSchema } from '$lib/chart';
	import TextField from './TextField.svelte';
	import SelectField from './SelectField.svelte';
	import type { Chart } from '@prisma/client';
	import Form from './Form.svelte';

	export let data: Chart | undefined = undefined;
	export let action = '?/newExerciseEvent';
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
</script>

<Form schema={chartSchema} {data} {action} {id} {onSuccess} let:form>
	<TextField name="name" {form} field="name" placeholder={'Pull-ups volume'} />

	<SelectField name="type" {form} field="type">
		<option value="line"> Line Graph </option>
		<option value="bar"> Bar Graph </option>
		<option value="heatmap"> Heatmap </option>
	</SelectField>

	<SelectField name="matchAgainst" {form} field="matchAgainst">
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
	<TextField name="patternToMatch" {form} field="patternToMatch" placeholder={'pull-ups'} />
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
	<TextField name="equation" {form} field="equation" placeholder={'sets*reps'} />
	<br />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</Form>
