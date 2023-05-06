<script lang="ts">
	import type { PageData } from './$types';

	import ProfileForm from '$lib/components/forms/FormProfile.svelte';

	export let data: PageData;
</script>

<h1>Edit Profile</h1>

<div class="grid grid-cols-1">
	<div>
		<ProfileForm data={data?.profile} />
	</div>
</div>
