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
	export let debug = false;

	const exerciseOptions = exercises.map((e) => ({ label: e.name, value: e.id }));
</script>

<Form
	schema={exerciseEventSchema}
	bind:data
	{action}
	{id}
	{onSuccess}
	{debug}
	let:form
	let:formData
>
	{#if data?.exerciseId == null}
		<label>
			<span class="font-bold">Apply migration to all exercises with the same name</span>
			<br />
			<input type="checkbox" name="shouldApplyMigrationToAll" />
		</label>
		<br />
	{/if}

	{#if showDate}
		<DateField name="date" field="date" {form} />
	{/if}

	<Autocomplete name="exerciseId" field="exerciseId" options={exerciseOptions} {form} />
	<div class="mb-3">
		<a href="/exercise/new" class="link" target="_blank">Don't see your exercise? Add it here.</a>
	</div>

	{#if exerciseToMarkCompleted != undefined}
		<input type="hidden" name="exerciseToMarkCompletedId" value={exerciseToMarkCompleted.id} />
	{/if}
	{#if dateToMarkCompleted != undefined}
		<input type="hidden" name="dateToMarkCompleted" value={dateToMarkCompleted.toString()} />
	{/if}

	{#if formData.exerciseId}
		{@const exercise = exercises.find((e) => e.id == formData.exerciseId)}
		{#if exercise != undefined}
			<div class="flex flex-wrap gap-2">
				{#if exercise.fieldsToShow.find((f) => f == 'sets')}
					<NumberField class="w-20" name="sets" field="sets" {form} />
				{/if}
				{#if exercise.fieldsToShow.find((f) => f == 'reps')}
					<NumberField class="w-20" name="reps" field="reps" {form} />
				{/if}

				<div class="w-full md:hidden" />
				{#if exercise.fieldsToShow.find((f) => f == 'minutes')}
					<NumberField class="w-20" name="minutes" field="minutes" {form} />
				{/if}
				{#if exercise.fieldsToShow.find((f) => f == 'seconds')}
					<NumberField class="w-20" name="seconds" field="seconds" {form} />
				{/if}

				<div class="w-full md:hidden" />

				{#if exercise.fieldsToShow.find((f) => f == 'weight')}
					<NumberField class="w-20" name="weight" field="weight" step={'0.1'} {form} />
				{/if}

				{#if showDifficulty}
					<NumberField class="w-20" name="difficulty" field="difficulty" {form} />
				{/if}
			</div>
			<div class="mb-4">
				<a href={`/exercise/${exercise.id}/edit`} class="link" target="_blank"
					>Don't see the correct fields for your exercise? Edit them here.</a
				>
			</div>
		{:else}
			Something went wrong, please contact someone on the feedback page.
		{/if}
	{/if}

	<TextArea class="w-full" name="notes" field="notes" {form} />

	{#if showSubmitButton}
		<button class="btn btn-sm variant-filled">Submit</button>
	{/if}
</Form>
