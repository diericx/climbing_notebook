<script lang="ts">
  import TextField from '../fields/TextField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let showEquation = true;
</script>

<TextField name="name" field="name" form={superForm} />

<SelectField name="table" field="table" form={superForm}>
  <option value="exerciseEvent">Exercise Events</option>
  <option value="metric"> Metrics </option>
</SelectField>

{#if showEquation}
  <TextField name="equation" field="equation" placeholder="sets*reps" form={superForm}>
    <div slot="description">
      A simple math equation. Each attribute of the resource is given as a variable.
      <br />
      <i>Exercise Events: </i> sets, reps, weight, minutes, seconds
      <br />
      <i>Metrics: </i> value
    </div>
  </TextField>
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
