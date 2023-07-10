<script lang="ts">
  import type { Exercise } from '@prisma/client';
  import TextField from './fields/TextField.svelte';
  import { exerciseSchema } from '$lib/exercise';
  import Form from './Form.svelte';
  import {
    difficulties,
    equipments,
    exerciseEventFieldsToShow,
    exerciseTypes,
    muscleGroups,
    muscles,
    postures,
  } from '$lib/utils';
  import SelectField from './fields/SelectField.svelte';
  import MultipleSelectField from './fields/MultipleSelectField.svelte';
  import { v4 as uuidv4 } from 'uuid';

  export let data: Exercise | undefined = undefined;
  export let action = '';

  export let id = uuidv4();
  export let showSubmitButton = true;
  export let onSuccess: (() => void) | undefined = undefined;
</script>

<Form schema={exerciseSchema} bind:data {action} {id} {onSuccess} let:form>
  <TextField name="name" field="name" {form} />

  <SelectField name="type" field="type" {form}>
    {#each exerciseTypes as type}
      <option value={type}>{type}</option>
    {/each}
  </SelectField>
  <SelectField name="difficulty" field="difficulty" {form}>
    <option value={null}>N/A</option>
    {#each difficulties as difficulty}
      <option value={difficulty}>{difficulty}</option>
    {/each}
  </SelectField>
  <SelectField name="muscleGroup" field="muscleGroup" {form}>
    <option value={null}>N/A</option>
    {#each muscleGroups as muscleGroup}
      <option value={muscleGroup}>{muscleGroup}</option>
    {/each}
  </SelectField>
  <SelectField name="primeMoverMuscle" field="primeMoverMuscle" {form}>
    <option value={null}>N/A</option>
    {#each muscles as muscle}
      <option value={muscle}>{muscle}</option>
    {/each}
  </SelectField>
  <SelectField name="secondaryMuscle" field="secondaryMuscle" {form}>
    <option value={null}>N/A</option>
    {#each muscles as muscle}
      <option value={muscle}>{muscle}</option>
    {/each}
  </SelectField>
  <SelectField name="tertiaryMuscle" field="tertiaryMuscle" {form}>
    <option value={null}>N/A</option>
    {#each muscles as muscle}
      <option value={muscle}>{muscle}</option>
    {/each}
  </SelectField>

  <SelectField name="primaryEquipment" field="primaryEquipment" {form}>
    <option value={null}>N/A</option>
    {#each equipments as equipment}
      <option value={equipment}>{equipment}</option>
    {/each}
  </SelectField>

  <SelectField name="posture" field="posture" {form}>
    <option value={null}>N/A</option>
    {#each postures as posture}
      <option value={posture}>{posture}</option>
    {/each}
  </SelectField>

  <MultipleSelectField
    name="fieldsToShow"
    field="fieldsToShow"
    options={[...exerciseEventFieldsToShow]}
    {form}
  />

  <TextField name="videoUrl" field="videoUrl" {form} />

  {#if showSubmitButton}
    <button class="btn btn-sm variant-filled">Submit</button>
  {/if}
</Form>
