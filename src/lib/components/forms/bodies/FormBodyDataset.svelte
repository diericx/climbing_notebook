<script lang="ts">
  import type { DatasetSchema } from '$lib/zodSchemas';
  import type { Infer } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import ColorField from '../fields/ColorField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<Infer<DatasetSchema>>;

  export let showSubmitButton = true;
  export let showColor = true;
  export let showType = true;
</script>

<TextField name="name" field="name" form={superForm}>
  <div slot="description">This will be the label on the chart</div>
</TextField>
{#if showColor}
  <ColorField name="color" field="color" form={superForm} />
{/if}

{#if showType}
  <SelectField name="type" form={superForm} field="type">
    <option value="line"> Line Graph </option>
    <option value="bar"> Bar Graph </option>
  </SelectField>
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
