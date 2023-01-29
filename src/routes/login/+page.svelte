<script lang="ts">
	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;
	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<div class="my-4">
	<h2>Login</h2>
	<form method="POST" action="?/login">
		<input type="hidden" name="redirectTo" value={redirectTo} />
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
	<form method="POST" action="?/register">
		<input type="hidden" name="redirectTo" value={redirectTo} />
		<label for="username">username</label>
		<br />
		<input type="username" name="username" value={form?.username || ''} />
		<br />
		<label for="password">password</label>
		<br />
		<input type="password" name="password" />
		<br />
		<button>Register</button>
	</form>
</div>
