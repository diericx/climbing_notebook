<script lang="ts">
  import { trainingProgramSchema } from '$lib/trainingProgram';
  import FormBodyTrainingProgram from '../../forms/bodies/FormBodyTrainingProgram.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingProgramSchema} let:superForm let:formProps>
  <FormBodyTrainingProgram {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
