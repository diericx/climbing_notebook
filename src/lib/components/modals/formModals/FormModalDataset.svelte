<script lang="ts">
  import { datasetSchema } from '$lib/widget';
  import FormBodyDataset from '../../forms/bodies/FormBodyDataset.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={datasetSchema} let:superForm let:formProps>
  <FormBodyDataset {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
