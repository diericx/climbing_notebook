<script lang="ts">
  import type { Prisma } from '@prisma/client';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import Autocomplete from '../fields/Autocomplete.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextField from '../fields/TextField.svelte';

  export let exercises: Prisma.ExerciseGetPayload<{
    select: {
      _count: {
        select: {
          exerciseEvents: true;
        };
      };
      id: true;
      name: true;
      fieldsToShow: true;
    };
  }>[];
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
          <div class="card px-4 py-2 bg-gray-50">No Exercise Selected</div>
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
  <div class="w-full sm:w-64">
    <TextField name="metric" field="metric" placeholder="leftShoulderPain" form={superForm}>
      <div slot="description">The exact metric name</div>
    </TextField>
  </div>
{/if}

{#if showEquation}
  <TextField
    name="equation"
    field="equation"
    placeholder={$form.table == 'exerciseEvent' ? 'sets*reps' : 'value'}
    form={superForm}
  >
    <div slot="description">
      A simple math equation to determine the value for each data point. Each attribute of the
      resource is given as a variable.
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
