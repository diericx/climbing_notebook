<script lang="ts">
  import { exerciseEventSchema } from '$lib/zodSchemas';
  import FormBodyExerciseEvent from '../../forms/bodies/FormBodyExerciseEvent.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={exerciseEventSchema} let:superForm let:formProps>
  <FormBodyExerciseEvent {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
