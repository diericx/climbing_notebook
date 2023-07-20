<script lang="ts">
  import type { TrainingProgram } from '@prisma/client';
  import SelectField from '../fields/SelectField.svelte';
  import NumberField from '../fields/NumberField.svelte';
  import TextField from '../fields/TextField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  // Form action to execute
  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let showType = true;
  export let showOrder = true;
  export let showWidth = true;
  export let showSimpleFields = true;
  export let trainingPrograms: TrainingProgram[] = [];

  const { form } = superForm;
  let setsFieldEnabled = $form.sets != null && $form.sets != undefined;
  console.log($form.sets, setsFieldEnabled);
</script>

<TextField name="name" field="name" form={superForm} />
{#if showOrder}
  <NumberField name="order" field="order" form={superForm} />
{/if}

{#if showWidth}
  <SelectField name="width" field="width" form={superForm}>
    <option value="full">Full</option>
    <option value="half">Half</option>
  </SelectField>
{/if}

{#if showType}
  <SelectField name="type" field="type" form={superForm}>
    <option value="chart"> Chart </option>
    <option value="calendar"> Full Calendar </option>
    <option value="heatmapCalendar"> Heatmap Calendar </option>
    <option value="dailyExerciseCalendar"> Daily Exercise Calendar </option>
  </SelectField>
{/if}

{#if $form.type == 'dailyExerciseCalendar'}
  <SelectField
    name="trainingProgramId"
    field="trainingProgramId"
    label="Training Program"
    form={superForm}
  >
    <option value={null}> Active Training Program </option>
    <option disabled>---------</option>
    {#each trainingPrograms as trainingProgram}
      <option value={trainingProgram.id}> {trainingProgram.name} </option>
    {/each}
  </SelectField>
{/if}

{#if showSimpleFields}
  <label>
    <input
      type="checkbox"
      bind:checked={setsFieldEnabled}
      on:change={() => {
        $form.sets = $form.sets == null ? ($form.sets = 0) : ($form.sets = null);
      }}
    />
    Enable Sets Field
  </label>
  {#if setsFieldEnabled}
    <NumberField class="w-20" name="sets" field="sets" form={superForm} />
  {/if}
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
