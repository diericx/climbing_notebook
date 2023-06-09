<script lang="ts">
	import type { Exercise, ExerciseEvent } from '@prisma/client';
	import TextField from './fields/TextField.svelte';
	import TextArea from './fields/TextArea.svelte';
	import DateField from './fields/DateField.svelte';
	import NumberField from './fields/NumberField.svelte';
	import { Autocomplete, popup } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { exerciseEventSchema } from '$lib/exerciseEvent';
	import Form from './Form.svelte';
	import { v4 as uuidv4 } from 'uuid';

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
	let searchInput = '';

	function onExerciseSelect(event: any): void {
		searchInput = event.detail.label;
	}

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};
</script>

<Form schema={exerciseEventSchema} bind:data {action} {id} {onSuccess} let:form>
	<label>
		<span class="font-bold">Exercise</span>
		<br />
		<input
			class="autocomplete"
			type="search"
			name="autocomplete-search"
			bind:value={searchInput}
			placeholder="Search..."
			use:popup={popupSettings}
		/>
	</label>

	<div
		data-popup="popupAutocomplete"
		class="card w-full max-w-xs max-h-48 p-4 overflow-y-auto overflow-x-hidden z-50"
		tabindex="-1"
	>
		<Autocomplete
			bind:input={searchInput}
			options={exerciseOptions}
			on:selection={onExerciseSelect}
		/>
	</div>

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
