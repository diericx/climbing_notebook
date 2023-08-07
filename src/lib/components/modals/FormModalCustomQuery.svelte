<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormBodyCustomQuery from '../forms/bodies/FormBodyCustomQuery.svelte';
  import FormModal from './FormModal.svelte';
  import { customQuerySchema } from '$lib/customQuery';

  let showOperator = $modalStore[0]?.meta?.showOperator;
  let exercises = $modalStore[0]?.meta?.exercises;
</script>

<FormModal schema={customQuerySchema} let:superForm>
  <FormBodyCustomQuery {exercises} {showOperator} {superForm} showSubmitButton={false} />
</FormModal>
