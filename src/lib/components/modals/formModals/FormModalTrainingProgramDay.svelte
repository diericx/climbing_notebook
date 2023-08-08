<script lang="ts">
  import FormBodyTrainingProgramDay from '../../forms/bodies/FormBodyTrainingProgramDay.svelte';
  import FormModal from './FormModal.svelte';
  import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
</script>

<FormModal schema={trainingProgramDaySchema} let:superForm let:formProps>
  <FormBodyTrainingProgramDay {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
