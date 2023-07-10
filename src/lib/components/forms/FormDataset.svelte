<script lang="ts">
  import type { CustomQuery, Dataset } from '@prisma/client';
  import Form from './Form.svelte';
  import TextField from './fields/TextField.svelte';
  import SelectField from './fields/SelectField.svelte';
  import { datasetSchema } from '$lib/widget';
  import ColorField from './fields/ColorField.svelte';
  import { v4 as uuidv4 } from 'uuid';

  // Form action to execute
  export let action = '';
  export let data: Dataset | undefined = undefined;
  export let onSuccess: (() => void) | undefined = undefined;
  export let id = uuidv4();
  export let customQueries: CustomQuery[];
  export let showSubmitButton = true;
  export let showColor = true;
  export let showEquation = true;
  export let showType = true;
</script>

<Form schema={datasetSchema} {data} {action} {id} {onSuccess} resetForm={true} let:form>
  <TextField name="name" field="name" {form} />
  {#if showColor}
    <ColorField name="color" field="color" {form} />
  {/if}

  <SelectField name="customQueryId" field="customQueryId" label="Query" {form}>
    <div slot="description">
      Go to the <a class="link" href="/query">Queries</a> page to craft custom queries.
    </div>
    {#each customQueries as query}
      <option value={query.id}>{query.name}</option>
    {/each}
  </SelectField>

  {#if showEquation}
    <TextField name="equation" field="equation" placeholder="sets*reps" {form}>
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
    <SelectField name="type" {form} field="type">
      <option value="line"> Line Graph </option>
      <option value="bar"> Bar Graph </option>
    </SelectField>
  {/if}

  {#if showSubmitButton}
    <button class="btn btn-primary btn-sm variant-filled">Submit</button>
  {/if}
</Form>
