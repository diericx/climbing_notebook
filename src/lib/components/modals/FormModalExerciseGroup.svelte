<script lang="ts">
  import FormExerciseGroup from '../forms/FormExerciseGroup.svelte';
  import FormModal from './FormModal.svelte';
  import { exerciseGroupSchema } from '$lib/exerciseGroup';
</script>

<FormModal schema={exerciseGroupSchema} let:superForm>
  <FormExerciseGroup {superForm} showSubmitButton={false} />
</FormModal>
