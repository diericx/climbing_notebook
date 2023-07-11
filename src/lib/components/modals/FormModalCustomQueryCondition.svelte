<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormModal from './FormModal.svelte';
  import { customQueryConditionSchema } from '$lib/customQuery';
  import FormBodyCustomQueryCondition from '../forms/bodies/FormBodyCustomQueryCondition.svelte';

  let query = $modalStore[0]?.meta?.query;
</script>

<FormModal schema={customQueryConditionSchema} let:superForm>
  <FormBodyCustomQueryCondition {query} {superForm} showSubmitButton={false} />
</FormModal>
