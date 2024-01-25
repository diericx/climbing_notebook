<script lang="ts">
  import { customQuerySchema } from '$lib/zodSchemas';
  import FormBodyCustomQuery from '../../forms/bodies/FormBodyCustomQuery.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={customQuerySchema} let:superForm let:formProps>
  <FormBodyCustomQuery {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
