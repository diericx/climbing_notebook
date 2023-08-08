<script lang="ts">
  import FormBodyExerciseEvent from '../../forms/bodies/FormBodyExerciseEvent.svelte';
  import FormModal from './FormModal.svelte';
  import { exerciseEventSchema } from '$lib/exerciseEvent';
</script>

<FormModal schema={exerciseEventSchema} let:superForm let:formProps>
  <FormBodyExerciseEvent {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
