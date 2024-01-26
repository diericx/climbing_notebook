<script lang="ts">
  import FormBodyTrainingProgramScheduledSlot from '$lib/components/forms/bodies/FormBodyTrainingProgramScheduledSlot.svelte';
  import { trainingProgramScheduledSlotSchema } from '$lib/zodSchemas';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingProgramScheduledSlotSchema} let:superForm let:formProps>
  <FormBodyTrainingProgramScheduledSlot {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
