<script lang="ts">
  import FormModal from './FormModal.svelte';
  import { customQueryConditionSchema } from '$lib/customQuery';
  import FormBodyCustomQueryCondition from '../../forms/bodies/FormBodyCustomQueryCondition.svelte';
</script>

<FormModal schema={customQueryConditionSchema} let:superForm let:formProps>
  <FormBodyCustomQueryCondition {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
