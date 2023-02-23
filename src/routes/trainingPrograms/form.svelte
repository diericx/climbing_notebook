<script lang="ts">
	import { onMount } from 'svelte';
	import { TrainingProgramDayFormData, type TrainingProgramFormData } from '$lib/trainingProgram';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import ExerciseEventForm from '../trainingLog/minimalInlineForm.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';

	export let trainingProgramFormData: TrainingProgramFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';

	let daysOfTheWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="name">Name</label>
	<br />
	<input
		name="name"
		placeholder="Upper body + hang board"
		bind:value={trainingProgramFormData.name}
		style="min-width: 300px"
	/>
	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
