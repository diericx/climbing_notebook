<script lang="ts">
	import { ProfileFormData } from '$lib/profile';
	import TabEnabledTextArea from '$lib/components/tabEnabledTextArea.svelte';
	import type { Profile } from '@prisma/client';
	import { page } from '$app/stores';

	// Form action to execute
	export let action = '?/editProfile';

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	export let profile: Profile | undefined = undefined;
	export let profileFormData: ProfileFormData = new ProfileFormData();
	if (profile != undefined) {
		profileFormData = new ProfileFormData(profile);
	}
</script>

<form method="POST" {action}>
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
