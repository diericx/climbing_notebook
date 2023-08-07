<script lang="ts">
  import FormModal from './FormModal.svelte';
  import { widgetTemplateSchema } from '$lib/widget';
  import FormBodyWidgetTemplate from '../forms/bodies/FormBodyWidgetTemplate.svelte';
</script>

<FormModal schema={widgetTemplateSchema} let:superForm>
  <FormBodyWidgetTemplate {superForm} showSubmitButton={false} />
</FormModal>
