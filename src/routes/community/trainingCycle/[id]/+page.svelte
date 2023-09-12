<script context="module" lang="ts">
  export function getPageTitle(data: any) {
    return data.trainingCycle?.name;
  }
</script>

<script lang="ts">
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import Icon from '@iconify/svelte';
  import { Avatar } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';
  dayjs.extend(localizedFormat);

  export let data: PageData;

  $: trainingCycle = data.trainingCycle;
</script>

<div class="flex justify-between mb-2">
  <h1 class="font-bold">{trainingCycle.name}</h1>

  <FormButton
    action={`/trainingCycle/${trainingCycle.id}?/import&redirectTo=/trainingCycle`}
    class="btn btn-sm variant-filled"
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
    <span>Import Training Cycle</span>
  </FormButton>
</div>

<div class="text-gray-600 flex items-center mb-8">
  <Avatar
    class="text-white"
    width="w-9"
    initials={trainingCycle.owner.username}
    background="bg-primary-500"
  />
  <div class="ml-2 align-middle items-center">
    <div class="text-md leading-none font-bold">{trainingCycle.owner.username}</div>
  </div>
</div>
<WeeklyCalendar {trainingCycle} />
