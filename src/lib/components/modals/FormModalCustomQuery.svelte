<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormCustomQuery from '../forms/FormCustomQuery.svelte';
  import FormModal from './FormModal.svelte';
  import { customQuerySchema } from '$lib/customQuery';

  let showOperator = $modalStore[0]?.meta?.showOperator;
</script>

<FormModal schema={customQuerySchema} let:superForm>
  <FormCustomQuery {showOperator} {superForm} showSubmitButton={false} />
</FormModal>
