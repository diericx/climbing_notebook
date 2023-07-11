<script lang="ts">
  import FormBodyTrainingProgramDay from '../forms/bodies/FormBodyTrainingProgramDay.svelte';
  import FormModal from './FormModal.svelte';
  import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
</script>

<FormModal schema={trainingProgramDaySchema} let:superForm>
  <FormBodyTrainingProgramDay {superForm} showSubmitButton={false} />
</FormModal>
