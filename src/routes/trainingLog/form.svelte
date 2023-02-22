<script lang="ts">
	import { onMount } from 'svelte';
	import type { ExerciseEventFormData } from '$lib/exerciseEvent';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';

	export let exerciseEventFormData: ExerciseEventFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';

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
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="date">Date</label>
	<br />
	<input type="date" name="date" bind:value={dateString} style="width: 150px" />
	<br />

	<label for="name">Name</label>
	<br />
	<input
		name="name"
		placeholder="Pull-Ups 3x7"
		bind:value={exerciseEventFormData.name}
		style="width: 150px"
	/>
	<br />

	<label for="weight">Weight</label>
	<br />
	<input
		type="number"
		name="weight"
		style="width: 150px"
		bind:value={exerciseEventFormData.weight}
	/>
	<br />

	<label for="difficulty">Difficulty</label>
	<br />
	<input
		type="number"
		name="difficulty"
		style="width: 150px"
		bind:value={exerciseEventFormData.difficulty}
	/>
	<br />

	<label for="notes">Notes</label>
	<br />
	<TabEnabledTextArea
		name="notes"
		cols="40"
		rows="3"
		placeholder=""
		bind:value={exerciseEventFormData.notes}
	/>
	<br />

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
