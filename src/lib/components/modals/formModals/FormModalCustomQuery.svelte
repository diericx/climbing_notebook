<script lang="ts">
  import FormBodyCustomQuery from '../../forms/bodies/FormBodyCustomQuery.svelte';
  import FormModal from './FormModal.svelte';
  import { customQuerySchema } from '$lib/customQuery';
</script>

<FormModal schema={customQuerySchema} let:superForm let:formProps>
  <FormBodyCustomQuery {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
