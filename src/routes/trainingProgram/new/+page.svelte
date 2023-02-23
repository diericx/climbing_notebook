<script lang="ts">
	import type { PageData, ActionData } from './$types';

	import TrainingProgramForm from '../form.svelte';
	import { TrainingProgramFormData } from '$lib/trainingProgram';

	export let data: PageData;
	export let form: ActionData;
	const trainingProgramFormData: TrainingProgramFormData =
		(form?.journalEntryFormData as TrainingProgramFormData) || new TrainingProgramFormData();

	function confirmDelete(e: MouseEvent) {
		if (!confirm('Are you sure you want to delete this exercise?')) {
			e.preventDefault();
		}
	}
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>New Training Program</h1>
		<TrainingProgramForm action="/trainingPrograms?/new" {trainingProgramFormData} />
	</div>
</div>
