<script lang="ts">
  import FormBodyTrainingCycleTemplate from '$lib/components/forms/bodies/FormBodyTrainingCycleTemplate.svelte';
  import { trainingCycleTemplateSchema } from '$lib/trainingCycle';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingCycleTemplateSchema} let:superForm let:formProps>
  <FormBodyTrainingCycleTemplate {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
