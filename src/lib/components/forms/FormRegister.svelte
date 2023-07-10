<script lang="ts">
  import { loginSchema } from '$lib/user';
  import PasswordField from './fields/PasswordField.svelte';
  import TextField from './fields/TextField.svelte';
  import Form from './Form.svelte';
  import { v4 as uuidv4 } from 'uuid';

  // Form action to execute
  export let action = '';
  export let onSuccess: (() => Promise<void>) | undefined = undefined;
  export let id = uuidv4();
</script>

<Form schema={loginSchema} {action} {id} {onSuccess} let:form>
  <input type="hidden" name="_formId" value={id} />
  <input type="hidden" name="type" value="climbing" />

  <TextField name="username" field="username" {form} />
  <TextField name="email" field="email" {form} />
  <PasswordField name="password" field="password" {form} />

  <button class="btn btn-primary btn-sm variant-filled">Register</button>
</Form>
