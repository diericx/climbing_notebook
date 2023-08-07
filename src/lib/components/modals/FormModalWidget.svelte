<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormBodyWidget from '../forms/bodies/FormBodyWidget.svelte';
  import FormModal from './FormModal.svelte';
  import { widgetSchema } from '$lib/widget';

  let trainingPrograms = $modalStore[0]?.meta?.trainingPrograms;
  let meta = $modalStore[0]?.meta;
</script>

<FormModal schema={widgetSchema} let:superForm>
  <FormBodyWidget {superForm} {...meta} {trainingPrograms} showSubmitButton={false} />
</FormModal>
