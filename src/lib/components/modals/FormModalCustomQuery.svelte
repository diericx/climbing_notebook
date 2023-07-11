<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormBodyCustomQuery from '../forms/bodies/FormBodyCustomQuery.svelte';
  import FormModal from './FormModal.svelte';
  import { customQuerySchema } from '$lib/customQuery';

  let showOperator = $modalStore[0]?.meta?.showOperator;
</script>

<FormModal schema={customQuerySchema} let:superForm>
  <FormBodyCustomQuery {showOperator} {superForm} showSubmitButton={false} />
</FormModal>
