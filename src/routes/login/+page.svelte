<script lang="ts">
	import FormLogin from '$lib/components/forms/FormLogin.svelte';
	import FormRegister from '$lib/components/forms/FormRegister.svelte';
</script>

<div class="my-4">
	<h2>Login</h2>
	<FormLogin action="?/login" />
	<div class="mt-2">
		<a class="link" href="/login/requestResetPassword">Reset My Password</a>
	</div>
</div>

<hr />

<div class="my-4">
	<h2>Register</h2>
	<FormRegister action="?/register" />
</div>
