<script type="ts">
	import FormResetPassword from '$lib/components/forms/FormResetPassword.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Reset Password</h1>
<FormResetPassword token={data.token} action="/login/resetPassword?/resetPassword" />
