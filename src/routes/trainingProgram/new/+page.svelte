<script lang="ts">
	import TrainingProgramForm from '../form.svelte';
	import { TrainingProgramFormData } from '$lib/trainingProgram';
	import type { ActionData } from '../$types';

	export let form: ActionData;
	const trainingProgramFormData: TrainingProgramFormData =
		(form?.journalEntryFormData as TrainingProgramFormData) || new TrainingProgramFormData();
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>New Training Program</h1>
		<TrainingProgramForm {trainingProgramFormData} />
	</div>
</div>
