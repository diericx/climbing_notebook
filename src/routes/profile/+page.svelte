<script lang="ts">
	import { signOut, getUser } from '@lucia-auth/sveltekit/client';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	const user = getUser();

	export let data: PageData;
</script>

<br />

<h1>Account Info</h1>
<hr />
<p>Username: {$user?.username}</p>
<p>Email: {$user?.email}</p>

<br />

<h1 class="inline">Profile</h1>
<a href={`/profile/${$user?.userId}/edit?redirectTo=/profile`}>Edit</a>
<hr />

<h2>Goals</h2>

<div class="whitespace-pre bg-white w-full px-1 py-3 rounded ">
	{data.profile.goals}
</div>

<br />

<br />

<button
	on:click={async () => {
		await signOut();
		invalidateAll();
	}}>Logout</button
>
