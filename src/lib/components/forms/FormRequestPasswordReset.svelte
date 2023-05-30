<script lang="ts">
	import { loginSchema } from '$lib/user';
	import TextField from './fields/TextField.svelte';
	import Form from './Form.svelte';

	// Form action to execute
	export let action = '';
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
	export let id = crypto.randomUUID();
</script>

<Form schema={loginSchema} {action} {id} {onSuccess} let:form>
	<TextField name="email" field="email" {form} />
	<button class="btn btn-primary btn-sm variant-filled">Send Email</button>
</Form>
