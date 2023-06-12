<script lang="ts">
	import type { PageData } from './$types';

	import FormExerciseEvent from '$lib/components/forms/FormExerciseEvent.svelte';

	export let data: PageData;
	$: exerciseEvent = data.exerciseEvent;
	$: exercises = data.exercises;
</script>

{#if exerciseEvent == null}
	There are no exercise events to be converted!
{:else}
	Original name: {exerciseEvent.name}
	<br />
	<FormExerciseEvent
		resetForm={true}
		debug={true}
		{exercises}
		data={exerciseEvent}
		action={`/admin/exerciseMigration/exerciseEvent/${exerciseEvent.id}?/edit`}
		id={exerciseEvent.id}
		showDifficulty={false}
		showDate={true}
		showSubmitButton={true}
	/>
{/if}
