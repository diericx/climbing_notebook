<script lang="ts">
  import { projectSessionSchema } from '$lib/project';
  import FormBodyProjectSession from '../../forms/bodies/FormBodyProjectSession.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={projectSessionSchema} let:superForm let:formProps>
  <FormBodyProjectSession {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
