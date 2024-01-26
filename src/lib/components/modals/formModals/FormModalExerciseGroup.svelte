<script lang="ts">
  import { exerciseGroupSchema } from '$lib/zodSchemas';
  import FormBodyExerciseGroup from '../../forms/bodies/FormBodyExerciseGroup.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={exerciseGroupSchema} let:superForm let:formProps>
  <FormBodyExerciseGroup {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
