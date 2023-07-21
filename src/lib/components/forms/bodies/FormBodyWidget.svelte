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
  export let showName = true;
  export let showType = true;
  export let showOrder = true;
  export let showWidth = true;
  export let showSimpleFields = false;
  export let trainingPrograms: TrainingProgram[] = [];

  const { form } = superForm;

  // If any of these fields is null, then the form does not show a field and is
  // thus "disabled". Check boxes allow the user to set a value.
  let setsFieldEnabled = $form.sets != null && $form.sets != undefined;
  let repsFieldEnabled = $form.reps != null && $form.reps != undefined;
  let weightFieldEnabled = $form.weight != null && $form.weight != undefined;
  let minutesFieldEnabled = $form.minutes != null && $form.minutes != undefined;
  let secondsFieldEnabled = $form.seconds != null && $form.seconds != undefined;
</script>

{#if showName}
  <TextField name="name" field="name" form={superForm} />
{/if}

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
    <NumberField
      class="w-20"
      name="sets"
      field="sets"
      label="Default Sets Value"
      form={superForm}
    />
  {/if}

  <label>
    <input
      type="checkbox"
      bind:checked={repsFieldEnabled}
      on:change={() => {
        $form.reps = $form.reps == null ? ($form.reps = 0) : ($form.reps = null);
      }}
    />
    Enable Reps Field
  </label>
  {#if repsFieldEnabled}
    <NumberField
      class="w-20"
      name="reps"
      field="reps"
      label="Default Reps Value"
      form={superForm}
    />
  {/if}

  <label>
    <input
      type="checkbox"
      bind:checked={weightFieldEnabled}
      on:change={() => {
        $form.weight = $form.weight == null ? ($form.weight = 0) : ($form.weight = null);
      }}
    />
    Enable weight Field
  </label>
  {#if weightFieldEnabled}
    <NumberField
      class="w-20"
      name="weight"
      field="weight"
      label="Default weight Value"
      form={superForm}
    />
  {/if}

  <label>
    <input
      type="checkbox"
      bind:checked={minutesFieldEnabled}
      on:change={() => {
        $form.minutes = $form.minutes == null ? ($form.minutes = 0) : ($form.minutes = null);
      }}
    />
    Enable minutes Field
  </label>
  {#if minutesFieldEnabled}
    <NumberField
      class="w-20"
      name="minutes"
      field="minutes"
      label="Default minutes Value"
      form={superForm}
    />
  {/if}

  <label>
    <input
      type="checkbox"
      bind:checked={secondsFieldEnabled}
      on:change={() => {
        $form.seconds = $form.seconds == null ? ($form.seconds = 0) : ($form.seconds = null);
      }}
    />
    Enable seconds Field
  </label>
  {#if secondsFieldEnabled}
    <NumberField
      class="w-20"
      name="seconds"
      field="seconds"
      label="Default seconds Value"
      form={superForm}
    />
  {/if}
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
