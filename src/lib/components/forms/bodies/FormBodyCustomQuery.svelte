<script lang="ts">
  import TextField from '../fields/TextField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import type { Exercise } from '@prisma/client';
  import Autocomplete from '../fields/Autocomplete.svelte';

  export let exercises: Exercise[];
  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let showEquation = true;

  const { form } = superForm;
  const exerciseOptions = exercises.map((e) => ({
    label: e.name,
    value: e.id,
    meta: { _count: { ...e._count } },
  }));
</script>

<TextField name="name" field="name" form={superForm} />

<SelectField name="table" field="table" form={superForm}>
  <option value="exerciseEvent">Exercise Events</option>
  <option value="metric"> Metrics </option>
</SelectField>

{#if $form.table == 'exerciseEvent'}
  <div class="w-full sm:w-64">
    <Autocomplete
      name="exerciseId"
      field="exerciseId"
      options={exerciseOptions}
      form={superForm}
      label="Exercise"
    >
      <div slot="pre">
        {#if $form.exerciseId}
          <div class="card px-4 py-2">
            <span class="text-black">
              {exercises.find((e) => e.id == $form.exerciseId)?.name}
            </span>
            <br />
          </div>
        {:else}
          <div class="card px-4 py-2 bg-gray-50">No Exercise</div>
        {/if}
      </div>
    </Autocomplete>
    <div class="mb-3">
      <a href="/exercise/new" class="link" target="_blank"
        >Don't see your exercise? <br /> Click here to add it.</a
      >
    </div>
  </div>
{:else if $form.table == 'metric'}
  M
{/if}

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
