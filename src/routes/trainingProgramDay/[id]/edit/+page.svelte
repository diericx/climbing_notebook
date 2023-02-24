<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	import TrainingProgramDayForm from '../../form.svelte';
	import { TrainingProgramDayFormData } from '$lib/trainingProgramDay';

	export let data: PageData;
	export let form: ActionData;

	// Either grab form data from the Sveltekit form obj,
	// or generate a new one from incoming page data
	const trainingProgramDayFormData: TrainingProgramDayFormData =
		(form?.trainingProgramDayFormData as TrainingProgramDayFormData) ||
		TrainingProgramDayFormData.fromObject(data?.trainingProgramDay);

	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="server-message {$page.status == 200 ? 'success' : 'error'}">
		{form?.message}
	</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>Edit Day</h2>
		<TrainingProgramDayForm action="?/edit" {redirectTo} {trainingProgramDayFormData} />
	</div>
</div>
