<script lang="ts">
  import FormBodyTrainingProgramActivation from '$lib/components/forms/bodies/FormBodyTrainingProgramActivation.svelte';
  import { trainingProgramActivationSchema } from '$lib/trainingProgram';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingProgramActivationSchema} let:superForm let:formProps>
  <FormBodyTrainingProgramActivation {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
