<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormBodyDataset from '../forms/bodies/FormBodyDataset.svelte';
  import FormModal from './FormModal.svelte';
  import { datasetSchema } from '$lib/widget';

  let customQueries = $modalStore[0]?.meta?.customQueries;
  let showColor = $modalStore[0]?.meta?.showColor;
  let showType = $modalStore[0]?.meta?.showType;
  let showEquation = $modalStore[0]?.meta?.showEquation;
</script>

<FormModal schema={datasetSchema} let:superForm>
  <FormBodyDataset
    {customQueries}
    {showColor}
    {showType}
    {showEquation}
    {superForm}
    showSubmitButton={false}
  />
</FormModal>
