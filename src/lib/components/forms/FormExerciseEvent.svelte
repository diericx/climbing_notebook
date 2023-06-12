<script lang="ts">
	import type { Exercise, ExerciseEvent } from '@prisma/client';
	import TextArea from './fields/TextArea.svelte';
	import DateField from './fields/DateField.svelte';
	import NumberField from './fields/NumberField.svelte';
	import { exerciseEventSchema } from '$lib/exerciseEvent';
	import Form from './Form.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import Autocomplete from './fields/Autocomplete.svelte';

	export let data: ExerciseEvent | undefined;
	export let action = '';
	export let exercises: Exercise[];

	export let dateToMarkCompleted: Date | undefined = undefined;
	export let exerciseToMarkCompleted: ExerciseEvent | undefined = undefined;
	export let showDifficulty = true;
	export let showDate = true;
	export let id = uuidv4();
	export let showSubmitButton = true;
	export let onSuccess: (() => void) | undefined = undefined;

	const exerciseOptions = exercises.map((e) => ({ label: e.name, value: e.id }));
</script>

<Form schema={exerciseEventSchema} bind:data {action} {id} {onSuccess} let:form>
	<Autocomplete name="exerciseId" field="exerciseId" options={exerciseOptions} {form} />
	<a href="/exercise/new" class="link" target="_blank">Don't see your exercise? Add it here.</a>

	{#if exerciseToMarkCompleted != undefined}
		<input type="hidden" name="exerciseToMarkCompletedId" value={exerciseToMarkCompleted.id} />
	{/if}
	{#if dateToMarkCompleted != undefined}
		<input type="hidden" name="dateToMarkCompleted" value={dateToMarkCompleted.toString()} />
	{/if}

	{#if showDate}
		<DateField name="date" field="date" {form} />
	{/if}

	<div class="flex flex-wrap gap-2">
		<NumberField class="w-20" name="sets" field="sets" {form} />
		<NumberField class="w-20" name="reps" field="reps" {form} />

		<div class="w-full md:hidden" />
		<NumberField class="w-20" name="minutes" field="minutes" {form} />
		<NumberField class="w-20" name="seconds" field="seconds" {form} />

		<div class="w-full md:hidden" />

		<NumberField class="w-20" name="weight" field="weight" step={'0.1'} {form} />

		{#if showDifficulty}
			<NumberField class="w-20" name="difficulty" field="difficulty" {form} />
		{/if}
	</div>

	<TextArea class="w-full" name="notes" field="notes" {form} />

	{#if showSubmitButton}
		<button class="btn btn-sm variant-filled">Submit</button>
	{/if}
</Form>
