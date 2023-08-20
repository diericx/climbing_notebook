<script lang="ts">
  import { loginSchema } from '$lib/user';
  import { v4 as uuidv4 } from 'uuid';
  import PasswordField from './fields/PasswordField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import TextField from './fields/TextField.svelte';
  import Form from './Form.svelte';

  // Form action to execute
  export let action = '';
  export let onSuccess: (() => Promise<void>) | undefined = undefined;
  export let id = uuidv4();
</script>

<Form schema={loginSchema} {action} {id} {onSuccess} let:superForm>
  <input type="hidden" name="_formId" value={id} />
  <input type="hidden" name="type" value="climbing" />

  <TextField name="username" field="username" form={superForm} />
  <TextField name="email" field="email" form={superForm} />
  <PasswordField name="password" field="password" form={superForm} />

  <SubmitButton label="Register" {superForm} />
</Form>
