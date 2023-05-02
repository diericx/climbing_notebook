<script lang="ts">
	import { ExerciseEventFormData } from '$lib/exerciseEvent';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import type { ExerciseEvent, ExerciseGroup, TrainingProgramDay } from '@prisma/client';
	import DateInput from '$lib/components/dateInput.svelte';
	import EnhancedForm from '$lib/components/enhancedForm.svelte';

	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action = '';

	// The exercise event that this form represents, which defines the defaults only
	export let exerciseEvent: ExerciseEvent | undefined = undefined;
	export let exerciseGroup: ExerciseGroup | undefined = undefined;
	export let trainingProgramDay: TrainingProgramDay | undefined = undefined;
	export let formData = new ExerciseEventFormData();
	export let showDifficulty = true;
	export let showDate = true;
	export let id = crypto.randomUUID();
	export let showButton = true;
	export let onSuccess: (() => void) | undefined = undefined;
</script>

<EnhancedForm
	{action}
	{id}
	{onSuccess}
	bind:formData
	formDataDefaults={new ExerciseEventFormData(
		exerciseEvent || {
			date: new Date(),
			name: '',
			sets: 0,
			reps: 0,
			minutes: 0,
			seconds: 0,
			weight: 0,
			difficulty: 0,
			notes: ''
		}
	)}
>
	{#if exerciseGroup != undefined}
		<input type="hidden" name="exerciseGroupId" value={exerciseGroup.id} />
	{/if}
	{#if trainingProgramDay != undefined}
		<input type="hidden" name="trainingProgramDayId" value={trainingProgramDay.id} />
	{/if}

	{#if showDate}
		<div class="flex">
			<div>
				<label for="date">Date</label>
				<br />
				<DateInput name="date" bind:date={formData.date} style="width: 150px" />
			</div>
		</div>
	{/if}

	<div>
		<label for="name">Name</label>
		<br />
		<input
			type="text"
			name="name"
			placeholder="Pull-Ups 3x7"
			bind:value={formData.name}
			style="width: 150px"
		/>
	</div>

	<div class="flex flex-wrap gap-2">
		<div>
			<label for="sets">Sets</label>
			<br />
			<input type="number" style="width: 75px" name="sets" bind:value={formData.sets} />
		</div>

		<div>
			<label for="reps">Reps</label>
			<br />
			<input type="number" style="width: 75px" name="reps" bind:value={formData.reps} />
		</div>

		<div class="w-full md:hidden" />

		<div>
			<label for="minutes">Minutes</label>
			<br />
			<input type="number" name="minutes" style="width: 75px" bind:value={formData.minutes} />
		</div>

		<div>
			<label for="seconds">Seconds</label>
			<br />
			<input type="number" name="seconds" style="width: 75px" bind:value={formData.seconds} />
		</div>

		<div class="w-full md:hidden" />

		<div>
			<label for="weight">Weight</label>
			<br />
			<input
				type="number"
				step="0.1"
				name="weight"
				style="width: 75px"
				bind:value={formData.weight}
			/>
		</div>

		{#if showDifficulty}
			<div>
				<label for="difficulty">Difficulty</label>
				<br />
				<input
					type="number"
					name="difficulty"
					style="width: 75px"
					bind:value={formData.difficulty}
				/>
			</div>
		{/if}
	</div>

	<div class="sm:col-span-4">
		<label for="notes">Notes</label>
		<br />
		<TabEnabledTextArea
			name="notes"
			cols="40"
			rows="3"
			placeholder=""
			class="w-full"
			bind:value={formData.notes}
		/>
	</div>

	{#if showButton}
		<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button
		>
	{/if}
</EnhancedForm>
