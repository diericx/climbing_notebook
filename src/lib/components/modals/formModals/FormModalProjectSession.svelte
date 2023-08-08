<script lang="ts">
  import FormModal from './FormModal.svelte';
  import { projectSessionSchema } from '$lib/project';
  import FormBodyProjectSession from '../../forms/bodies/FormBodyProjectSession.svelte';
</script>

<FormModal schema={projectSessionSchema} let:superForm let:formProps>
  <FormBodyProjectSession {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
