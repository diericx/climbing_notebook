<script lang="ts">
	import { signOut, getUser } from '@lucia-auth/sveltekit/client';
	import { invalidateAll } from '$app/navigation';
	const user = getUser();
</script>

<h1>Profile</h1>

<p>Username: {$user?.username}</p>

<button
	on:click={async () => {
		await signOut();
		invalidateAll();
	}}>Sign out</button
>
