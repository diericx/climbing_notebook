<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	import ProfileForm from '../../form.svelte';
	import { ProfileFormData } from '$lib/profile';

	export let data: PageData;
	export let form: ActionData;

	// Either grab form data from the Sveltekit form obj,
	// or generate a new one from incoming page data
	const profileFormData: ProfileFormData =
		(form?.profileFormData as ProfileFormData) || ProfileFormData.fromObject(data?.profile);

	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="server-message {$page.status == 200 ? 'success' : 'error'}">
		{form?.message}
	</p>{/if}

<br />

<h1>Edit Profile</h1>

<div class="grid grid-cols-1">
	<div>
		<ProfileForm action="?/edit" {redirectTo} {profileFormData} />
	</div>
</div>
