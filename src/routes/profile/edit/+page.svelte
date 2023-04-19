<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	import ProfileForm from '../form.svelte';
	import { ProfileFormData } from '$lib/profile';

	export let data: PageData;
	export let form: ActionData;
</script>

{#if form?.message}<p class="server-message {$page.status == 200 ? 'success' : 'error'}">
		{form?.message}
	</p>{/if}

<br />

<h1>Edit Profile</h1>

<div class="grid grid-cols-1">
	<div>
		<ProfileForm
			profile={data?.profile}
			profileFormData={new ProfileFormData(form?.profileFormData)}
		/>
	</div>
</div>
