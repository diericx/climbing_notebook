<script lang="ts">
  import FormModal from './FormModal.svelte';
  import { exerciseSchema } from '$lib/exercise';
  import FormBodyExercise from '../forms/bodies/FormBodyExercise.svelte';
</script>

<FormModal schema={exerciseSchema} let:superForm>
  <FormBodyExercise {superForm} showSubmitButton={false} />
</FormModal>
