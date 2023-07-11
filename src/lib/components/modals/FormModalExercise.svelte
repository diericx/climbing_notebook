<script lang="ts">
  import FormModal from './FormModal.svelte';
  import { exerciseSchema } from '$lib/exercise';
  import FormExercise from '../forms/FormExercise.svelte';
</script>

<FormModal schema={exerciseSchema} let:superForm>
  <FormExercise {superForm} showSubmitButton={false} />
</FormModal>
