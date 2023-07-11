<script lang="ts">
  import type { CustomQuery } from '@prisma/client';
  import TextField from './fields/TextField.svelte';
  import SelectField from './fields/SelectField.svelte';
  import ColorField from './fields/ColorField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;

  export let customQueries: CustomQuery[];
  export let showSubmitButton = true;
  export let showColor = true;
  export let showEquation = true;
  export let showType = true;
</script>

<TextField name="name" field="name" form={superForm} />
{#if showColor}
  <ColorField name="color" field="color" form={superForm} />
{/if}

<SelectField name="customQueryId" field="customQueryId" label="Query" form={superForm}>
  <div slot="description">
    Go to the <a class="link" href="/query">Queries</a> page to craft custom queries.
  </div>
  {#each customQueries as query}
    <option value={query.id}>{query.name}</option>
  {/each}
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

{#if showType}
  <SelectField name="type" form={superForm} field="type">
    <option value="line"> Line Graph </option>
    <option value="bar"> Bar Graph </option>
  </SelectField>
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
