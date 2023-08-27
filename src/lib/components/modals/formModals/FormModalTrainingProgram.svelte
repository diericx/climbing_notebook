<script lang="ts">
  import FormBodyTrainingProgram from '$lib/components/forms/bodies/FormBodyTrainingProgram.svelte';
  import { trainingProgramSchema } from '$lib/trainingProgram';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingProgramSchema} let:superForm let:formProps>
  <FormBodyTrainingProgram {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
