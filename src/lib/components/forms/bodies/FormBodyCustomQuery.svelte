<script lang="ts">
  import TextField from '../fields/TextField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let showOperator = true;
</script>

<TextField name="name" field="name" form={superForm} />

<SelectField name="table" field="table" form={superForm}>
  <option value="exerciseEvent">Exercise Events</option>
  <option value="metric"> Metrics </option>
</SelectField>

{#if showOperator}
  <SelectField name="operator" field="operator" form={superForm}>
    <option value="AND"> AND </option>
    <option value="OR">OR </option>
  </SelectField>
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
