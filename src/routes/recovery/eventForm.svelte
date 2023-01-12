<script lang="ts">
	import { onMount } from 'svelte';
	import { presetEvents, presetTrainingEvents, presetRecoveryEvents } from '$lib/events.js';
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
	});
	let formSelections = {
		type: presetEvents[0].type,
		amount: 0,
		event: presetEvents[0]
	};
	function onFormChange(_event) {
		if (formSelections.type == 'training') {
			formSelections.event = presetEvents.find((event) => event.label == _event.target.value);
		} else {
			formSelections.event = presetEvents.find((event) => event.label == _event.target.value);
		}
	}
</script>

<form method="POST" action="?/addRecoveryItem">
	<select name="label" on:change={onFormChange}>
		<optgroup label="training">
			{#each presetTrainingEvents as event}
				<option value={event.label}>{event.label}</option>
			{/each}
		</optgroup>
		<optgroup label="recovery">
			{#each presetRecoveryEvents as event}
				<option value={event.label}>{event.label}</option>
			{/each}
		</optgroup>
	</select>
	<input name="type" bind:value={formSelections.event.type} style="display: none" />
	<input type="number" name="amount" bind:value={formSelections.amount} style="width: 75px" />
	<input type="hidden" name="amountUnit" value={formSelections.event.amountUnit} />
	{formSelections.event.amountUnit}
	on
	<input
		style="display:none"
		type="number"
		name="pointsPerUnit"
		value={formSelections.event.pointsPerUnit}
	/>
	<input type="date" name="date" value={dateString} style="width: 150px" />
	for {formSelections.amount * formSelections.event.pointsPerUnit} points
	<br />
	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
