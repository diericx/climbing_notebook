<script lang="ts">
  import type { CustomQuery } from '@prisma/client';
  import TextField from './fields/TextField.svelte';
  import SelectField from './fields/SelectField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let query: CustomQuery;
</script>

{#if query.table == 'exerciseEvent'}
  <SelectField name="column" field="column" form={superForm}>
    <option value="name">Name</option>
    <option value="notes"> Notes </option>
  </SelectField>
{:else if query.table == 'metric'}
  <SelectField name="column" field="column" form={superForm}>
    <option value="name">Name</option>
  </SelectField>
{/if}

<SelectField name="condition" field="condition" form={superForm}>
  <option value="equals"> Equals </option>
  <option value="contains"> Contains </option>
</SelectField>

<TextField name="value" field="value" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
