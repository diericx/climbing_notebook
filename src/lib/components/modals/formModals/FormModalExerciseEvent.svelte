<script lang="ts">
  import { exerciseEventSchema } from '$lib/zodSchemas';
  import { useQueryClient } from '@sveltestack/svelte-query';
  import FormBodyExerciseEvent from '../../forms/bodies/FormBodyExerciseEvent.svelte';
  import FormModal from './FormModal.svelte';
  const queryClient = useQueryClient();
</script>

<FormModal
  schema={exerciseEventSchema}
  let:superForm
  let:formProps
  onSuccess={() => queryClient.invalidateQueries('exerciseEvents')}
>
  <FormBodyExerciseEvent {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
