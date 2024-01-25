<script lang="ts">
  import { widgetTemplateSchema } from '$lib/zodSchemas';
  import FormBodyWidgetTemplate from '../../forms/bodies/FormBodyWidgetTemplate.svelte';
  import FormModal from './FormModal.svelte';
</script>

<FormModal schema={widgetTemplateSchema} let:superForm let:formProps>
  <FormBodyWidgetTemplate {superForm} {...formProps} showSubmitButton={false} />
</FormModal>
