<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	import ExerciseEventForm from '../../form.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';

	export let data: PageData;
	export let form: ActionData;

	// Either grab form data from the Sveltekit form obj,
	// or generate a new one from incoming page data
	const exerciseEventFormData: ExerciseEventFormData =
		(form?.exerciseEventFormData as ExerciseEventFormData) ||
		ExerciseEventFormData.fromObject(data?.exerciseEvent);

	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="server-message {$page.status == 200 ? 'success' : 'error'}">
		{form?.message}
	</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>Edit Exercise Event</h2>
		<ExerciseEventForm action="?/editExerciseEvent" {redirectTo} {exerciseEventFormData} />
	</div>
</div>
