<script lang="ts">
  import FormModal from './FormModal.svelte';
  import { projectSessionSchema } from '$lib/project';
  import FormProjectSession from '../forms/FormProjectSession.svelte';
</script>

<FormModal schema={projectSessionSchema} let:superForm>
  <FormProjectSession {superForm} showSubmitButton={false} />
</FormModal>
