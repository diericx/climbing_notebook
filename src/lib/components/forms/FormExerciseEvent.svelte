<script lang="ts">
	import type { ExerciseEvent, ExerciseGroup, TrainingProgramDay } from '@prisma/client';
	import type { Validation } from 'sveltekit-superforms/index';
	import type { ExerciseEventSchema } from '$lib/exerciseEvent';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import TextField from './TextField.svelte';
	import TextArea from './TextArea.svelte';
	import DateField from './DateField.svelte';
	import NumberField from './NumberField.svelte';

	export let data: Validation<ExerciseEventSchema>;
	export let action = '';

	export let dateToMarkCompleted: Date | undefined = undefined;
	export let exerciseToMarkCompleted: ExerciseEvent | undefined = undefined;
	export let exerciseGroup: ExerciseGroup | undefined = undefined;
	export let trainingProgramDay: TrainingProgramDay | undefined = undefined;
	export let showDifficulty = true;
	export let showDate = true;
	export let id = crypto.randomUUID();
	export let showSubmitButton = true;
	export let onSuccess: (() => void) | undefined = undefined;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}
	// Add other query data
	if (exerciseToMarkCompleted != undefined && dateToMarkCompleted != undefined) {
		action += `&exerciseToMarkCompletedId=${
			exerciseToMarkCompleted.id
		}&dateToMarkCompleted=${dateToMarkCompleted.toString()}`;
	}

	const newSuperForm = superForm<ExerciseEventSchema>(data, {
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
	{#if exerciseGroup != undefined}
		<input type="hidden" name="exerciseGroupId" value={exerciseGroup.id} />
	{/if}
	{#if trainingProgramDay != undefined}
		<input type="hidden" name="trainingProgramDayId" value={trainingProgramDay.id} />
	{/if}

	{#if showDate}
		<DateField name="date" field="date" form={newSuperForm} />
	{/if}

	<TextField name="name" field="name" form={newSuperForm} placeholder={'Pull-ups 3x7'} />

	<div class="flex flex-wrap gap-2">
		<NumberField class="w-20" name="sets" field="sets" form={newSuperForm} />
		<NumberField class="w-20" name="reps" field="reps" form={newSuperForm} />

		<div class="w-full md:hidden" />
		<NumberField class="w-20" name="minutes" field="minutes" form={newSuperForm} />
		<NumberField class="w-20" name="seconds" field="seconds" form={newSuperForm} />

		<div class="w-full md:hidden" />

		<NumberField class="w-20" name="weight" field="weight" step={'0.1'} form={newSuperForm} />

		{#if showDifficulty}
			<NumberField class="w-20" name="difficulty" field="difficulty" form={newSuperForm} />
		{/if}
	</div>

	<TextArea class="w-full" name="notes" field="notes" form={newSuperForm} />

	{#if showSubmitButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</form>
