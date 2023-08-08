<script lang="ts">
  import FormBodyTrainingProgram from '../../forms/bodies/FormBodyTrainingProgram.svelte';
  import FormModal from './FormModal.svelte';
  import { trainingProgramSchema } from '$lib/trainingProgram';
</script>

<FormModal schema={trainingProgramSchema} let:superForm let:formProps>
  <FormBodyTrainingProgram {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
