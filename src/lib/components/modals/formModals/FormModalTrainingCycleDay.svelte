<script lang="ts">
  import { trainingCycleDaySchema } from '$lib/zodSchemas';
  import FormBodyTrainingCycleDay from '../../forms/bodies/FormBodyTrainingCycleDay.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingCycleDaySchema} let:superForm let:formProps>
  <FormBodyTrainingCycleDay {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
