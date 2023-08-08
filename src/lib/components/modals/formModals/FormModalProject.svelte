<script lang="ts">
  import FormBodyProject from '../../forms/bodies/FormBodyProject.svelte';
  import FormModal from './FormModal.svelte';
  import { projectSchema } from '$lib/project';
</script>

<FormModal schema={projectSchema} let:superForm let:formProps>
  <FormBodyProject {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
