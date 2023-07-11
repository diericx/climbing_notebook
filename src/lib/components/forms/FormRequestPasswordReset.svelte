<script lang="ts">
  import { loginSchema } from '$lib/user';
  import SubmitButton from './fields/SubmitButton.svelte';
  import TextField from './fields/TextField.svelte';
  import Form from './Form.svelte';
  import { v4 as uuidv4 } from 'uuid';

  // Form action to execute
  export let action = '';
  export let onSuccess: (() => Promise<void>) | undefined = undefined;
  export let id = uuidv4();
</script>

<Form schema={loginSchema} {action} {id} {onSuccess} let:superForm>
  <TextField name="email" field="email" form={superForm} />
  <SubmitButton label="Login" {superForm} />
</Form>
