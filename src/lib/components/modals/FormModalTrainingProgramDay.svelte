<script lang="ts">
  import FormTrainingProgramDay from '../forms/FormTrainingProgramDay.svelte';
  import FormModal from './FormModal.svelte';
  import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
</script>

<FormModal schema={trainingProgramDaySchema} let:superForm>
  <FormTrainingProgramDay {superForm} showSubmitButton={false} />
</FormModal>
