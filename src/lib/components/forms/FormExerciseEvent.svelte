<script lang="ts">
	import type { ExerciseEvent } from '@prisma/client';
	import TextField from './TextField.svelte';
	import TextArea from './TextArea.svelte';
	import DateField from './DateField.svelte';
	import NumberField from './NumberField.svelte';
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
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
	// Add other query data
	if (exerciseToMarkCompleted != undefined && dateToMarkCompleted != undefined) {
		action += `&exerciseToMarkCompletedId=${
			exerciseToMarkCompleted.id
		}&dateToMarkCompleted=${dateToMarkCompleted.toString()}`;
	}
</script>

<Form schema={exerciseEventSchema} bind:data {action} {id} {onSuccess} let:form>
	{#if data?.exerciseGroupId}
		<input type="hidden" name="exerciseGroupId" value={data?.exerciseGroupId} />
	{/if}
	{#if data?.trainingProgramDayId}
		<input type="hidden" name="trainingProgramDayId" value={data?.trainingProgramDayId} />
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
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</Form>
