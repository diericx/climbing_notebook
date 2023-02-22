<script lang="ts">
	import type { ProfileFormData } from '$lib/profile';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';

	export let profileFormData: ProfileFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/new';
	export let redirectTo: string = '';
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="goals">Goals</label>
	<br />
	<TabEnabledTextArea
		name="goals"
		cols="40"
		rows="10"
		class="w-full"
		placeholder=""
		bind:value={profileFormData.goals}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
