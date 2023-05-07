<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { profile, user } = data;
</script>

<h1>Account Info</h1>
<hr />
<p>Username: {user?.username}</p>
<p>Email: {user?.email}</p>

<br />

<h1 class="inline">Profile</h1>
<a href={`/profile/edit?redirectTo=/profile`}>Edit</a>
<hr />

<h2>Goals</h2>

<div class="whitespace-pre bg-white w-full px-1 py-3 rounded">
	{profile?.goals}
</div>

<br />

<br />
