<script lang="ts">
	import { onMount } from 'svelte';
	import type { TrainingEventInput } from '$lib/trainingEvent';
	import {
		trainingEventTemplates,
		workTrainingEventTemplates,
		recoveryTrainingEventTemplates,
		TrainingEventTemplate
	} from '$lib/trainingEventTemplate.js';
	import type { FormEventHandler } from '$lib/helperTypes';

	export let trainingEventInput: TrainingEventInput;

	export let labelHidden: boolean = false,
		typeHidden: boolean = false,
		amountHidden: boolean = false,
		amountUnitHidden: boolean = false,
		pointsPerUnitHidden: boolean = false,
		trainingEventTemplatesHidden: boolean = false;

	let now = new Date(),
		month,
		day,
		year;
	let dateString = '';
	onMount(() => {
		(month = '' + (now.getMonth() + 1)), (day = '' + now.getDate()), (year = now.getFullYear());

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		dateString = [year, month, day].join('-');

		// If we are going to use preset training events, apply the values of the first one
		// immediately after loading.
		if (!trainingEventTemplatesHidden) {
			applyTrainingEventTemplate(trainingEventTemplates[0]);
		}
	});

	// Take every value from the selected preset event and apply it onto our new event
	function applyTrainingEventTemplate(e: TrainingEventTemplate) {
		trainingEventInput.type = e.type;
		trainingEventInput.pointsPerUnit = e.pointsPerUnit;
		trainingEventInput.amountUnit = e.amountUnit;
		trainingEventInput.label = e.label;
	}

	function onFormChange(_event: FormEventHandler<HTMLInputElement>) {
		const target = _event.target as HTMLInputElement;
		let trainingEvent = trainingEventTemplates.find((event) => event.label == target.value);
		if (trainingEvent == null) {
			console.error('Event not found by label.');
			return;
		}
		applyTrainingEventTemplate(trainingEvent);
	}
</script>

<form method="POST" action="?/new">
	<label for="presetEvent">Preset Activity (custom activities coming soon)</label>
	<br />
	<select
		name="presetEvent"
		on:change={onFormChange}
		style={trainingEventTemplatesHidden ? 'display: none' : ''}
	>
		<optgroup label="training">
			{#each workTrainingEventTemplates as event}
				<option value={event.label}>{event.label}</option>
			{/each}
		</optgroup>
		<optgroup label="recovery">
			{#each recoveryTrainingEventTemplates as event}
				<option value={event.label}>{event.label}</option>
			{/each}
		</optgroup>
	</select>

	<br />

	<input
		type="label"
		name="label"
		placeholder="label"
		bind:value={trainingEventInput.label}
		style="min-width: 75px; {labelHidden ? 'display: none' : ''}"
	/>

	<select
		name="type"
		bind:value={trainingEventInput.type}
		style={typeHidden ? 'display: none' : ''}
	>
		<option value="work">work</option>
		<option value="recovery">recovery</option>
	</select>

	<label for="amount">Amount</label>
	<br />
	<input
		type="number"
		name="amount"
		bind:value={trainingEventInput.amount}
		style="min-width: 75px; {amountHidden ? 'display: none' : ''}"
		placeholder="amount"
	/>

	<input
		name="amountUnit"
		bind:value={trainingEventInput.amountUnit}
		placeholder="amount unit"
		style={amountUnitHidden ? 'display: none' : ''}
	/>
	{#if amountUnitHidden === true}
		{trainingEventInput.amountUnit}
	{/if}

	<input
		style={pointsPerUnitHidden ? 'display: none' : ''}
		type="number"
		name="pointsPerUnit"
		bind:value={trainingEventInput.pointsPerUnit}
		placeholder="points per unit"
	/>
	<br />
	<label for="date">Date</label>
	<br />
	<input type="date" name="date" bind:value={dateString} style="width: 150px" />
	<br />
	For {trainingEventInput.amount * trainingEventInput.pointsPerUnit || 0} points
	<br />
	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
