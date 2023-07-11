<script lang="ts">
  import FormTrainingProgram from '../forms/FormTrainingProgram.svelte';
  import FormModal from './FormModal.svelte';
  import { trainingProgramSchema } from '$lib/trainingProgram';
</script>

<FormModal schema={trainingProgramSchema} let:superForm>
  <FormTrainingProgram {superForm} showSubmitButton={false} />
</FormModal>
