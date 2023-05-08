<script lang="ts">
	import type { ActionData } from './$types';
	import { page } from '$app/stores';

	export let form: ActionData;

	// Add redirect data
	let redirectTo = '';
	if ($page.url.searchParams.has('redirectTo')) {
		redirectTo = '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<div class="my-4">
	<h2>Login</h2>
	<form method="POST" action={'?/login' + redirectTo}>
		<label for="username">username</label>
		<input type="username" name="username" value={form?.username || ''} />
		<label for="password">password</label>
		<input type="password" name="password" />
		<br />
		<button class="btn btn-sm variant-filled">Login</button>
	</form>
</div>

<hr />

<div class="my-4">
	<h2>Register</h2>
	<form method="POST" action={'?/register' + redirectTo}>
		<label for="username">username</label>
		<input type="username" name="username" value={form?.username || ''} />
		<label for="email">email</label>
		<input type="email" name="email" value={form?.email || ''} />
		<label for="password">password</label>
		<input type="password" name="password" />
		<br />
		<button class="btn btn-sm variant-filled">Register</button>
	</form>
</div>
