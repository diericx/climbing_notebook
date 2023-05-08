<script lang="ts">
	import type { ExerciseEvent } from '@prisma/client';
	import TextField from './fields/TextField.svelte';
	import TextArea from './fields/TextArea.svelte';
	import DateField from './fields/DateField.svelte';
	import NumberField from './fields/NumberField.svelte';
	import { exerciseEventSchema } from '$lib/exerciseEvent';
	import Form from './Form.svelte';

	export let data: ExerciseEvent | undefined;
	export let action = '';

	export let dateToMarkCompleted: Date | undefined = undefined;
	export let exerciseToMarkCompleted: ExerciseEvent | undefined = undefined;
	export let showDifficulty = true;
	export let showDate = true;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => void) | undefined = undefined;
</script>

<Form schema={exerciseEventSchema} bind:data {action} {id} {onSuccess} let:form>
	{#if data?.exerciseGroupId}
		<input type="hidden" name="exerciseGroupId" value={data?.exerciseGroupId} />
	{/if}
	{#if data?.trainingProgramDayId}
		<input type="hidden" name="trainingProgramDayId" value={data?.trainingProgramDayId} />
	{/if}
	{#if exerciseToMarkCompleted != undefined}
		<input type="hidden" name="exerciseToMarkCompletedId" value={exerciseToMarkCompleted.id} />
	{/if}
	{#if dateToMarkCompleted != undefined}
		<input type="hidden" name="dateToMarkCompleted" value={dateToMarkCompleted.toString()} />
	{/if}

	{#if showDate}
		<DateField name="date" field="date" {form} />
	{/if}

	<TextField name="name" field="name" {form} placeholder={'Pull-ups 3x7'} />

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
