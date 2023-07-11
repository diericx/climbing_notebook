<script lang="ts">
  import FormBodyProject from '../forms/bodies/FormBodyProject.svelte';
  import FormModal from './FormModal.svelte';
  import { projectSchema } from '$lib/project';
</script>

<FormModal schema={projectSchema} let:superForm>
  <FormBodyProject {superForm} showSubmitButton={false} />
</FormModal>
