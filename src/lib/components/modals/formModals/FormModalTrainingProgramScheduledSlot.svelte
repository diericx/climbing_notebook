<script lang="ts">
  import FormBodyTrainingProgramScheduledSlot from '$lib/components/forms/bodies/FormBodyTrainingProgramScheduledSlot.svelte';
  import { trainingProgramScheduledSlotSchema } from '$lib/zodSchemas';
  import { useQueryClient } from '@sveltestack/svelte-query';
  import FormModal from './FormModal.svelte';
  const queryClient = useQueryClient();
</script>

<FormModal
  schema={trainingProgramScheduledSlotSchema}
  let:superForm
  let:formProps
  onSuccess={() => queryClient.invalidateQueries('trainingProgramActivations')}
>
  <FormBodyTrainingProgramScheduledSlot {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
