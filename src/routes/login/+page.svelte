<script lang="ts">
	import type { ActionData } from './$types';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let form: ActionData;
	export let data: PageData;

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
		<br />
		<input type="username" name="username" value={form?.username || ''} />
		<br />
		<label for="password">password</label>
		<br />
		<input type="password" name="password" />
		<br />
		<button>Login</button>
	</form>
</div>

<hr />

<div class="my-4">
	<h2>Register</h2>
	<form method="POST" action={'?/register' + redirectTo}>
		<label for="username">username</label>
		<br />
		<input type="username" name="username" value={form?.username || ''} />
		<br />
		<label for="email">email</label>
		<br />
		<input type="email" name="email" value={form?.email || ''} />
		<br />
		<label for="password">password</label>
		<br />
		<input type="password" name="password" />
		<br />
		<button>Register</button>
	</form>
</div>
