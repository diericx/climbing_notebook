<script lang="ts">
  import { trainingCycleSchema } from '$lib/trainingCycle';
  import FormBodyTrainingCycle from '../../forms/bodies/FormBodyTrainingCycle.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingCycleSchema} let:superForm let:formProps>
  <FormBodyTrainingCycle {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
