<script lang="ts">
  import { projectSchema } from '$lib/project';
  import FormBodyProject from '../../forms/bodies/FormBodyProject.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={projectSchema} let:superForm let:formProps>
  <FormBodyProject {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
