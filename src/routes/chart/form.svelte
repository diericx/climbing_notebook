<script lang="ts">
	import type { ChartFormData } from '$lib/chart';

	export let chartFormData: ChartFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/newChart';
	export let redirectTo: string = '';
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />
	<input type="hidden" name="id" value={chartFormData._id} />

	<label for="name">Name</label>
	<br />
	<input
		name="name"
		placeholder="Upper body + hang board"
		bind:value={chartFormData.name}
		style="min-width: 300px"
	/>
	<br />

	<label for="patternToMatch">Pattern to Match</label>
	<br />
	<input
		name="patternToMatch"
		placeholder="pull-ups"
		bind:value={chartFormData.patternToMatch}
		style="min-width: 300px"
	/>
	<br />

	<label for="equation">Equation</label>
	<br />
	<input
		name="equation"
		placeholder="reps*sets*weight"
		bind:value={chartFormData.equation}
		style="min-width: 300px"
	/>
	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
