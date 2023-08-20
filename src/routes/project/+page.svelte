<script lang="ts">
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  export let data: PageData;

  $: projects = data.projects;
  $: sentProjects = projects.filter((p) => p.sessions.find((s) => s.sent == true) != undefined);
  $: unsentProjects = projects.filter((p) => p.sessions.find((s) => s.sent == true) == undefined);
</script>

<div class="flex justify-between mb-4">
  <h1>Projects</h1>
  <button
    class="btn btn-sm variant-filled mb-2"
    on:click={() =>
      modalStore.trigger({
        type: 'component',
        component: 'formModalProject',
        meta: {
          action: `/project?/new`,
          title: 'New Project',
        },
      })}
  >
    <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
    <span>New Project</span>
  </button>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#if projects.length == 0}
    <p class="text-gray-400 italic">You have no projects yet</p>
  {/if}
  {#each [...unsentProjects, ...sentProjects] as project}
    {@const sent = project.sessions.find((s) => s.sent)}
    <div class="block card card-hover {sent ? 'bg-green-50' : 'bg-white'}">
      <a class="flex-1" href={`/project/${project.id}`}>
        <header class="card-header">
          <div class="flex justify-between">
            <h2>
              <b>
                {project.name}
              </b>
            </h2>

            <FormButton
              action={`/project/${project.id}?/delete`}
              class="btn btn-sm variant-ringed"
              onClick={confirmDelete}
            >
              <Icon icon="mdi:trash-outline" height="18" />
              Delete
            </FormButton>
          </div>
        </header>
        <section class="p-4">
          <p class="text-gray-400">
            {sent ? 'Sent' : ''}
          </p>
          <p class="text-gray-400">
            {project.gradeSystem == 'font' ? project.fontGrade : ''}
            {project.gradeSystem == 'hueco' ? project.huecoGrade : ''}
          </p>
          <p class="text-gray-400">
            {project.sessions.length} session{project.sessions.length == 1 ? '' : 's'}
          </p>
        </section>
      </a>
    </div>
  {/each}
</div>
