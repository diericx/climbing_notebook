<script lang="ts">
  import { customQueryConditionSchema } from '$lib/zodSchemas';
  import FormBodyCustomQueryCondition from '../../forms/bodies/FormBodyCustomQueryCondition.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={customQueryConditionSchema} let:superForm let:formProps>
  <FormBodyCustomQueryCondition {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
