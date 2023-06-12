<script lang="ts">
	import { loginSchema } from '$lib/user';
	import PasswordField from './fields/PasswordField.svelte';
	import Form from './Form.svelte';
	import { v4 as uuidv4 } from 'uuid';

	// Form action to execute
	export let action = '';
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
	export let id = uuidv4();
	export let token: string;
</script>

<Form data={{ token }} schema={loginSchema} {action} {id} {onSuccess} let:form>
	<PasswordField name="password" field="password" {form} />
	<button class="btn btn-primary btn-sm variant-filled">Submit</button>
</Form>
