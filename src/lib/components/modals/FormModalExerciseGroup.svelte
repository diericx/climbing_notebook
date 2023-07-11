<script lang="ts">
  import FormBodyExerciseGroup from '../forms/bodies/FormBodyExerciseGroup.svelte';
  import FormModal from './FormModal.svelte';
  import { exerciseGroupSchema } from '$lib/exerciseGroup';
</script>

<FormModal schema={exerciseGroupSchema} let:superForm>
  <FormBodyExerciseGroup {superForm} showSubmitButton={false} />
</FormModal>
