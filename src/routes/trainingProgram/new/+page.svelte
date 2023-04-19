<script lang="ts">
	import TrainingProgramForm from '../form.svelte';
	import { TrainingProgramFormData } from '$lib/trainingProgram';
	import type { ActionData } from '../$types';

	export let form: ActionData;
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>New Training Program</h1>
		<TrainingProgramForm
			action="/trainingProgram?/newTrainingProgram"
			trainingProgramFormData={new TrainingProgramFormData(form?.trainingProgramFormData)}
		/>
	</div>
</div>
