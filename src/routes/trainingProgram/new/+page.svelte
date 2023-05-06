<script lang="ts">
	import FormTrainingProgram from '$lib/components/forms/FormTrainingProgram.svelte';
</script>

<div class="grid grid-cols-1">
	<div>
		<h1>New Training Program</h1>
		<FormTrainingProgram action="/trainingProgram?/newTrainingProgram" />
	</div>
</div>
