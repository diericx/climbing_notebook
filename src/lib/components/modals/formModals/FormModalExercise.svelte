<script lang="ts">
  import { exerciseSchema } from '$lib/zodSchemas';
  import FormBodyExercise from '../../forms/bodies/FormBodyExercise.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={exerciseSchema} let:superForm let:formProps>
  <FormBodyExercise {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
