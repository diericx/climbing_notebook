<script lang="ts">
  import FormModal from './FormModal.svelte';
  import { exerciseSchema } from '$lib/exercise';
  import FormBodyExercise from '../../forms/bodies/FormBodyExercise.svelte';
</script>

<FormModal schema={exerciseSchema} let:superForm let:formProps>
  <FormBodyExercise {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
