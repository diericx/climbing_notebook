<script lang="ts">
	import type { ProfileFormData } from '$lib/profile';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';

	export let profileFormData: ProfileFormData;
	// Form action to execute, which may need to be specified if this is
	// used outside of this route
	export let action: string = '?/editProfile';
	export let redirectTo: string = '';
</script>

<form method="POST" {action}>
	<input type="hidden" name="redirectTo" value={redirectTo} />

	<label for="goals">Goals</label>
	<br />
	<TabEnabledTextArea
		name="goals"
		cols="40"
		rows="15"
		class="w-full"
		placeholder="3 weeks
- Be able to do 3 pull ups unassisted (shoulder recovery)

3 months
- Climb 7a boulder
- 5 pull ups @ 10kg
- 15mm hang @ 20kg

1 year
- Climb 7b
- 5 pull ups @ 15kg
- 10mm hang @ 10kg"
		bind:value={profileFormData.goals}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
