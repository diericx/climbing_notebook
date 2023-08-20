<script lang="ts">
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import ColorField from '../fields/ColorField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<z.AnyZodObject, any>;

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
