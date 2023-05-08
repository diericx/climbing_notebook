<script lang="ts">
	import { profileSchema } from '$lib/profile';
	import type { Profile } from '@prisma/client';
	import Form from './Form.svelte';
	import TextArea from './fields/TextArea.svelte';

	// Form action to execute
	export let action = '/profile/editProfile?/editProfile';
	export let data: Profile | undefined = undefined;
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
	export let id = crypto.randomUUID();
</script>

<Form schema={profileSchema} {data} {action} {id} {onSuccess} let:form>
	<input type="hidden" name="type" value="climbing" />
	<TextArea
		name="goals"
		field="goals"
		{form}
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
</Form>
