<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormModal from './FormModal.svelte';
  import { customQueryConditionSchema } from '$lib/customQuery';
  import FormBodyCustomQueryCondition from '../forms/bodies/FormBodyCustomQueryCondition.svelte';

  let query = $modalStore[0]?.meta?.query;
  let widget = $modalStore[0]?.meta?.widget;
</script>

<FormModal schema={customQueryConditionSchema} let:superForm>
  <FormBodyCustomQueryCondition {query} {widget} {superForm} showSubmitButton={false} />
</FormModal>
