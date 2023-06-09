<script lang="ts">
	import FormExercise from '$lib/components/forms/FormExercise.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: exercise = data.exercise;
</script>

<h1 class="mb-4">Edit Exercise</h1>

<FormExercise data={exercise} action={`/exercise/${exercise.id}?/edit&redirectTo=/exercise`} />
