<script lang="ts">
  import { isSimpleFieldInUse } from '$lib/widget';
  import type { Prisma, TrainingCycle } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import NumberField from '../fields/NumberField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';
  import TextField from '../fields/TextField.svelte';

  // Form action to execute
  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let widget: Prisma.WidgetGetPayload<{
    include: {
      datasets: {
        include: {
          customQueries: {
            include: {
              conditions: true;
            };
          };
        };
      };
    };
  }>;
  export let showSubmitButton = true;
  export let showName = true;
  export let showType = true;
  export let showOrder = true;
  export let showWidth = true;
  export let showDescription = false;
  export let showSimpleFields = false;
  export let showSimpleFieldCheckBoxes = true;
  export let showGoToAdvancedEditorLink = true;
  export let trainingCycles: TrainingCycle[] = [];
  export let allowedTypes: String[] = [
    'chart',
    'calendar',
    'heatmapCalendar',
    'dailyExerciseCalendar',
  ];

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

{#if showDescription}
  <TextArea name="description" field="description" form={superForm}>
    <p class="text-gray-400">Be as detailed as possible in the description</p>
  </TextArea>
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
    {#if allowedTypes.includes('chart')}
      <option value="chart"> Chart </option>
    {/if}
    {#if allowedTypes.includes('calendar')}
      <option value="calendar"> Full Calendar </option>
    {/if}
    {#if allowedTypes.includes('heatmapCalendar')}
      <option value="heatmapCalendar"> Heatmap Calendar </option>
    {/if}
    {#if allowedTypes.includes('dailyExerciseCalendar')}
      <option value="dailyExerciseCalendar"> Daily Exercise Calendar </option>
    {/if}
  </SelectField>
{/if}

{#if $form.type == 'dailyExerciseCalendar'}
  <SelectField
    name="trainingCycleId"
    field="trainingCycleId"
    label="Training Program"
    form={superForm}
  >
    <option value={null}> Active Training Program </option>
    <option disabled>---------</option>
    {#each trainingCycles as trainingCycle}
      <option value={trainingCycle.id}> {trainingCycle.name} </option>
    {/each}
  </SelectField>
{/if}

{#if showSimpleFields}
  {#if !$form.isTemplate}
    <hr class="border-red-100 divider my-4" />
  {/if}

  <div class="space-y-2">
    <div>
      {#if showSimpleFieldCheckBoxes}
        <label class="font-bold">
          <input
            type="checkbox"
            bind:checked={setsFieldEnabled}
            disabled={isSimpleFieldInUse(widget, 'sets')}
            on:change={() => {
              $form.sets = $form.sets == null ? ($form.sets = 0) : ($form.sets = null);
            }}
          />
          Enable Sets Field
        </label>
        {#if isSimpleFieldInUse(widget, 'sets')}
          <p class="text-gray-400 mb-1">
            You cannot disable this field because one or more query conditions depend on it
          </p>
        {/if}
      {/if}
      {#if setsFieldEnabled}
        <NumberField
          class="w-20"
          name="sets"
          field="sets"
          label={$form.isTemplate ? 'Default Sets Value' : 'Sets'}
          form={superForm}
        />
      {/if}
    </div>

    <div>
      {#if showSimpleFieldCheckBoxes}
        <label class="font-bold">
          <input
            type="checkbox"
            disabled={isSimpleFieldInUse(widget, 'reps')}
            bind:checked={repsFieldEnabled}
            on:change={() => {
              $form.reps = $form.reps == null ? ($form.reps = 0) : ($form.reps = null);
            }}
          />
          Enable Reps Field
        </label>
        {#if isSimpleFieldInUse(widget, 'reps')}
          <p class="text-gray-400 mb-1">
            You cannot disable this field because one or more query conditions depend on it
          </p>
        {/if}
      {/if}
      {#if repsFieldEnabled}
        <NumberField
          class="w-20"
          name="reps"
          field="reps"
          label={$form.isTemplate ? 'Default Reps Value' : 'Reps'}
          form={superForm}
        />
      {/if}
    </div>

    <div>
      {#if showSimpleFieldCheckBoxes}
        <label class="font-bold">
          <input
            type="checkbox"
            bind:checked={weightFieldEnabled}
            on:change={() => {
              $form.weight = $form.weight == null ? ($form.weight = 0) : ($form.weight = null);
            }}
          />
          Enable weight Field
        </label>
        {#if isSimpleFieldInUse(widget, 'weight')}
          <p class="text-gray-400 mb-1">
            You cannot disable this field because one or more query conditions depend on it
          </p>
        {/if}
      {/if}
      {#if weightFieldEnabled}
        <NumberField
          class="w-20"
          name="weight"
          field="weight"
          label={$form.isTemplate ? 'Default Weight Value' : 'Weight'}
          form={superForm}
        />
      {/if}
    </div>

    <div>
      {#if showSimpleFieldCheckBoxes}
        <label class="font-bold">
          <input
            type="checkbox"
            bind:checked={minutesFieldEnabled}
            on:change={() => {
              $form.minutes = $form.minutes == null ? ($form.minutes = 0) : ($form.minutes = null);
            }}
          />
          Enable minutes Field
        </label>
        {#if isSimpleFieldInUse(widget, 'minutes')}
          <p class="text-gray-400 mb-1">
            You cannot disable this field because one or more query conditions depend on it
          </p>
        {/if}
      {/if}
      {#if minutesFieldEnabled}
        <NumberField
          class="w-20"
          name="minutes"
          field="minutes"
          label={$form.isTemplate ? 'Default Minutes Value' : 'Minutes'}
          form={superForm}
        />
      {/if}
    </div>

    <div>
      {#if showSimpleFieldCheckBoxes}
        <label class="font-bold">
          <input
            type="checkbox"
            bind:checked={secondsFieldEnabled}
            on:change={() => {
              $form.seconds = $form.seconds == null ? ($form.seconds = 0) : ($form.seconds = null);
            }}
          />
          Enable seconds Field
        </label>
        {#if isSimpleFieldInUse(widget, 'seconds')}
          <p class="text-gray-400 mb-1">
            You cannot disable this field because one or more query conditions depend on it
          </p>
        {/if}
      {/if}
      {#if secondsFieldEnabled}
        <NumberField
          class="w-20"
          name="seconds"
          field="seconds"
          label={$form.isTemplate ? 'Default Seconds Value' : 'Seconds'}
          form={superForm}
        />
      {/if}
    </div>
  </div>

  {#if showGoToAdvancedEditorLink}
    <div class="mt-4">
      <a class="link" on:click={modalStore.close} href={`/widget/${widget.id}/edit`}
        >Go to advanced editor</a
      >
    </div>
  {/if}
{/if}

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
