<script lang="ts">
  import { loginSchema } from '$lib/zodSchemas';
  import { v4 as uuidv4 } from 'uuid';
  import Form from './Form.svelte';
  import PasswordField from './fields/PasswordField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';

  // Form action to execute
  export let action = '';
  export let onSuccess: (() => Promise<void>) | undefined = undefined;
  export let id = uuidv4();
  export let token: string;
</script>

<Form data={{ token }} schema={loginSchema} {action} {id} {onSuccess} let:superForm>
  <PasswordField name="password" field="password" form={superForm} />
  <SubmitButton label="Login" {superForm} />
</Form>
