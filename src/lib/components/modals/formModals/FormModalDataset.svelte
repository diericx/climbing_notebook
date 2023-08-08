<script lang="ts">
  import FormBodyDataset from '../../forms/bodies/FormBodyDataset.svelte';
  import FormModal from './FormModal.svelte';
  import { datasetSchema } from '$lib/widget';
</script>

<FormModal schema={datasetSchema} let:superForm let:formProps>
  <FormBodyDataset {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
