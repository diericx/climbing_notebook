<script lang="ts">
  import FormProject from '../forms/FormProject.svelte';
  import FormModal from './FormModal.svelte';
  import { projectSchema } from '$lib/project';
</script>

<FormModal schema={projectSchema} let:superForm>
  <FormProject {superForm} showSubmitButton={false} />
</FormModal>
