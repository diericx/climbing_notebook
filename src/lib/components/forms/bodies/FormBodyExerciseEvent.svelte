<script lang="ts">
  import { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
  import type { exerciseSelects } from '$lib/prismaHelpers/exerciseHelper';
  import { kgToLb, lbToKg } from '$lib/utils';
  import type { ExerciseEvent, Prisma } from '@prisma/client';
  import { onMount } from 'svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import Autocomplete from '../fields/Autocomplete.svelte';
  import DateField from '../fields/DateField.svelte';
  import NumberField from '../fields/NumberField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';

  export let superForm: SuperForm<z.AnyZodObject, any>;

  export let data:
    | Prisma.ExerciseEventGetPayload<typeof exerciseEventSelects.minimalValidator>
    | undefined;
  export let profile: Prisma.ProfileGetPayload<{
    select: {
      weightUnit: true;
    };
  }>;
  export let exercises: Prisma.ExerciseGetPayload<typeof exerciseSelects.minimalValidator>[] = [];
  export let dateToMarkCompleted: Date | undefined = undefined;
  export let exerciseToMarkCompleted: ExerciseEvent | undefined = undefined;
  export let showDifficulty = true;
  export let showDate = true;
  export let showSubmitButton = true;
  export let showMigrationOption = true;

  let exerciseSearchValue = '';
  let timer: NodeJS.Timeout;

  $: exerciseOptions = exercises.map((e) => ({
    label: e.name,
    value: e.id,
    meta: { _count: { ...e._count } },
  }));

  async function refreshExercises() {
    const res = await fetch(`/api/exercise?q=${exerciseSearchValue}&limit=${10}`);
    const values = await res.json();
    exercises = values;
    ensureSelectedExerciseIsInList();
  }

  // Ensure the selected exercise from the incoming event is always in the list
  function ensureSelectedExerciseIsInList() {
    if (data && data.exercise) {
      if (!exercises.find((e) => e.id == data?.exercise?.id)) {
        exercises = [...exercises, data.exercise];
      }
    }
  }

  onMount(() => {
    ensureSelectedExerciseIsInList();
    refreshExercises();
  });

  const debounce = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      refreshExercises();
    }, 200);
  };

  const { form } = superForm;
</script>

{#if showMigrationOption && !$form.exerciseId}
  <label>
    <span class="font-bold">Apply migration to all exercises with the same name</span>
    <br />
    <input type="checkbox" name="shouldApplyMigrationToAll" />
  </label>
  <br />
{/if}

{#if showDate}
  <DateField name="date" field="date" form={superForm} />
{/if}

<div class="w-full sm:w-64">
  <Autocomplete
    bind:searchValue={exerciseSearchValue}
    name="exerciseId"
    field="exerciseId"
    options={exerciseOptions}
    form={superForm}
    label="Exercise"
    on:keyup={() => debounce()}
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

{#if exerciseToMarkCompleted != undefined}
  <input type="hidden" name="exerciseToMarkCompletedId" value={exerciseToMarkCompleted.id} />
{/if}
{#if dateToMarkCompleted != undefined}
  <input type="hidden" name="dateToMarkCompleted" value={dateToMarkCompleted.toString()} />
{/if}

{#if $form.exerciseId}
  {@const exercise = exercises.find((e) => e.id == $form.exerciseId)}
  {#if exercise != undefined}
    <div class="flex flex-wrap gap-2">
      {#if exercise.fieldsToShow.find((f) => f == 'sets')}
        <NumberField class="w-20" name="sets" field="sets" form={superForm} />
      {/if}
      {#if exercise.fieldsToShow.find((f) => f == 'reps')}
        <NumberField class="w-20" name="reps" field="reps" form={superForm} />
      {/if}

      <div class="w-full md:hidden" />
      {#if exercise.fieldsToShow.find((f) => f == 'minutes')}
        <NumberField class="w-20" name="minutes" field="minutes" form={superForm} />
      {/if}
      {#if exercise.fieldsToShow.find((f) => f == 'seconds')}
        <NumberField class="w-20" name="seconds" field="seconds" form={superForm} />
      {/if}

      <div class="w-full md:hidden" />

      {#if exercise.fieldsToShow.find((f) => f == 'weight')}
        <NumberField
          class="w-20"
          label={'Weight (' + profile.weightUnit + ')'}
          name="weight"
          field="weight"
          step={'0.1'}
          form={superForm}
          shouldPerformUnitConversion={profile.weightUnit == 'lb'}
          unitConversionFunc={kgToLb}
          unitDeconversionFunc={lbToKg}
          shouldRound={true}
        />
      {/if}

      {#if showDifficulty}
        <NumberField class="w-20" name="difficulty" field="difficulty" form={superForm} />
      {/if}
    </div>
    <div class="mb-4">
      <a href={`/exercise/${exercise.id}/edit`} class="link" target="_blank"
        >Don't see the correct fields for your exercise? <br /> Edit them here.</a
      >
    </div>
  {:else}
    Something went wrong, please contact someone on the feedback page.
  {/if}
{/if}

<TextArea class="w-full" name="notes" field="notes" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
