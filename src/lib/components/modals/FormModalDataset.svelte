<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormDataset from '../forms/FormDataset.svelte';
  import FormModal from './FormModal.svelte';
  import { datasetSchema } from '$lib/widget';

  let customQueries = $modalStore[0]?.meta?.customQueries;
  let showColor = $modalStore[0]?.meta?.showColor;
  let showType = $modalStore[0]?.meta?.showType;
  let showEquation = $modalStore[0]?.meta?.showEquation;
</script>

<FormModal schema={datasetSchema} let:superForm>
  <FormDataset
    {customQueries}
    {showColor}
    {showType}
    {showEquation}
    {superForm}
    showSubmitButton={false}
  />
</FormModal>
