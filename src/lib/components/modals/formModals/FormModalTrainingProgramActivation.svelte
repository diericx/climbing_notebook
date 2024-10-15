<script lang="ts">
  import FormBodyTrainingProgramActivation from '$lib/components/forms/bodies/FormBodyTrainingProgramActivation.svelte';
  import { trainingProgramActivationSchema } from '$lib/zodSchemas';
  import { useQueryClient } from '@sveltestack/svelte-query';
  import FormModal from './FormModal.svelte';
  const queryClient = useQueryClient();
</script>

<FormModal
  schema={trainingProgramActivationSchema}
  let:superForm
  let:formProps
  onSuccess={() => queryClient.invalidateQueries('exerciseEvents')}
>
  <FormBodyTrainingProgramActivation {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
