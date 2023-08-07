<script lang="ts">
  import type { CustomQuery, Widget } from '@prisma/client';
  import TextField from '../fields/TextField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import Checkbox from '../fields/Checkbox.svelte';
  import NumberField from '../fields/NumberField.svelte';

  // Parent widget is required in order to fill in the values for
  // simple editor field selection
  export let widget: Widget;
  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let query: CustomQuery;

  const { form } = superForm;
  const availableWidgetFields = ['sets', 'reps', 'weight', 'minutes', 'seconds'].filter((f) => {
    let key = f as keyof Widget;
    return widget[key] != null;
  });
</script>

{#if query.table == 'exerciseEvent'}
  <SelectField name="column" field="column" form={superForm}>
    <option value="sets">sets</option>
    <option value="reps">reps</option>
    <option value="weight">weight</option>
    <option value="minutes">minutes</option>
    <option value="seconds">seconds</option>
  </SelectField>
{/if}

<SelectField name="condition" field="condition" form={superForm}>
  <option value="equals"> equals </option>
</SelectField>

<Checkbox
  name="useWidgetField"
  field="useWidgetField"
  label="Use a value from the Simple Editor Fields"
  form={superForm}
/>

{#if $form.useWidgetField}
  <SelectField name="widgetFieldToUse" field="widgetFieldToUse" form={superForm}>
    {#each availableWidgetFields as field}
      <option value={field}>{field}</option>
    {/each}
  </SelectField>
{:else}
  <NumberField name="value" field="value" form={superForm} />
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
