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

	<label class="font-bold" for="name">Name</label>
	<br />
	<input
		name="name"
		placeholder="Upper body + hang board"
		bind:value={chartFormData.name}
		style="min-width: 300px"
	/>
	<br />

	<label class="font-bold" for="matchAgainst">Match Against</label>
	<br />
	<span class="text-gray-400"
		>Chart data from exercise events or metrics collected in journal entries.</span
	>
	<br />
	<select name="matchAgainst">
		<option value="metrics"> Metrics </option>
		<option value="exerciseEvents"> Exercise Events </option>
	</select>
	<br />

	<label class="font-bold" for="patternToMatch">Pattern to Match</label>
	<br />
	<span class="text-gray-400"
		>This is a case insensitive <a
			href="https://github.com/ziishaned/learn-regex/blob/master/README.md">Regex</a
		>
		pattern that will check against exercise event names and other metric names.
		<br />
		For simple matching just enter the desired name such as "pull-ups".
	</span>
	<br />
	<input
		name="patternToMatch"
		placeholder="pull-ups"
		bind:value={chartFormData.patternToMatch}
		style="min-width: 300px"
	/>
	<br />

	<label class="font-bold" for="equation">Equation</label>
	<br />
	<span class="text-gray-400">
		This is a simple match equation where each attribute of an exercise event is given as a
		variable.
		<br />
		They are: sets, reps, weight, minutes, seconds.
		<br />
		For example, a valid equation might be: sets*reps*weight
	</span>
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
