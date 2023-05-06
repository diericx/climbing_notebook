<script lang="ts">
	import { page } from '$app/stores';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import TextArea from './TextArea.svelte';
	import { assignDefined } from '$lib/utils';
	import { profileSchema, type ProfileSchema } from '$lib/profile';
	import type { Profile } from '@prisma/client';

	// Form action to execute
	export let action = '/profile/editProfile?/editProfile';
	export let data: Profile | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;
	export let id = crypto.randomUUID();
	export let applyDefaults = false;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData = data;
	if (applyDefaults) {
		formData = assignDefined(defaultData(profileSchema), data || {});
	}
	console.log(formData);
	const newSuperForm = superForm<ProfileSchema>(formData, {
		resetForm: true,
		dataType: 'json',
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { enhance } = newSuperForm;
</script>

<form method="POST" {action} use:enhance {id}>
	<input type="hidden" name="type" value="climbing" />
	<TextArea
		name="goals"
		field="goals"
		form={newSuperForm}
		class="w-full"
		rows={15}
		placeholder={`
3 weeks
- Be able to do 3 pull ups unassisted (shoulder recovery)

3 months
- Climb 7a boulder
- 5 pull ups @ 10kg
- 15mm hang @ 20kg

1 year
- Climb 7b
- 5 pull ups @ 15kg
- 10mm hang @ 10kg
	`}
	/>

	<br />

	<button class="bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded">Submit</button>
</form>
