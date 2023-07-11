<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormModal from './FormModal.svelte';
  import { customQueryConditionSchema } from '$lib/customQuery';
  import FormCustomQueryCondition from '../forms/FormCustomQueryCondition.svelte';

  let query = $modalStore[0]?.meta?.query;
</script>

<FormModal schema={customQueryConditionSchema} let:superForm>
  <FormCustomQueryCondition {query} {superForm} showSubmitButton={false} />
</FormModal>
