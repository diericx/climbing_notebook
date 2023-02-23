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

	<div class="flex grid-cols-3">
		<div>
			<label for="name">Name</label>
			<br />
			<input
				name="name"
				placeholder="Pull-Ups 3x7"
				bind:value={exerciseEventFormData.name}
				style="width: 150px"
			/>
		</div>
		<div>
			<label for="weight">Weight</label>
			<br />
			<input
				type="number"
				name="weight"
				style="width: 150px"
				bind:value={exerciseEventFormData.weight}
			/>
			<br />
		</div>
		<div class="grow">
			<label for="notes">Notes</label>
			<br />
			<TabEnabledTextArea
				name="notes"
				rows="1"
				placeholder=""
				class="w-full"
				bind:value={exerciseEventFormData.notes}
			/>
		</div>
	</div>
</form>
