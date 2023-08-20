<script lang="ts">
  import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
  import FormBodyTrainingProgramDay from '../../forms/bodies/FormBodyTrainingProgramDay.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={trainingProgramDaySchema} let:superForm let:formProps>
  <FormBodyTrainingProgramDay {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
