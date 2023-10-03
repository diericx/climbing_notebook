<script lang="ts" context="module">
  export function getPageTitle(data: any) {
    return data.project?.name;
  }
</script>

<script lang="ts">
  import Image from '$lib/components/Image.svelte';
  import Form from '$lib/components/forms/Form.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import FormBodyFileUpload from '$lib/components/forms/bodies/FormBodyFileUpload.svelte';
  import dayjs from '$lib/dayjs';
  import { fileUploadSchema } from '$lib/file';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  export let data: PageData;

  $: s3ObjectUrls = data.s3ObjectUrls;
  $: s3ObjectMetadatas = data.s3ObjectMetadatas;
  $: project = data.project;
</script>

<div class="mb-8">
  <h1 class="font-bold">{project.name}</h1>
</div>

<div class="mb-8">
  <h2>Details</h2>
  <hr class="mb-2" />

  <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
    <div class="flex justify-between">
      <div>
        <p>
          <b>Grade:</b>
          {project.grade}
        </p>
        <p>
          <b>Notes:</b>
          {#if project.notes}
            {project.notes}
          {:else}
            <span class="text-gray-400 italic">No notes</span>
          {/if}
        </p>
        <p>
          <b>URL:</b>
          {#if project.url === null}
            <span class="text-gray-400 italic">No url</span>
          {:else}
            <a class="link" href={project.url}>{project.url}</a>
          {/if}
        </p>
        <b>Image</b>
        {#if project.imageS3ObjectKey}
          <FormButton
            action={`/project/${project.id}?/deleteImage`}
            class="btn btn-sm variant-ringed"
            onClick={confirmDelete}
          >
            <slot name="form">
              <input type="hidden" name="key" value={project.imageS3ObjectKey} />
            </slot>
            <Icon icon="mdi:trash-outline" height="18" />
            <span class="ml-1 mr-1"> Delete Image </span>
          </FormButton>
          <Image
            src={s3ObjectUrls[project.imageS3ObjectKey]}
            width={s3ObjectMetadatas[project.imageS3ObjectKey]?.width || '0'}
            height={s3ObjectMetadatas[project.imageS3ObjectKey]?.height || '0'}
            class={'max-h-96'}
          />
        {:else}
          <Form
            schema={fileUploadSchema}
            let:superForm
            action={`/project/${project.id}?/uploadImage`}
          >
            <FormBodyFileUpload label="" {superForm} />
          </Form>
        {/if}
      </div>

      <div>
        <button
          class="btn btn-sm variant-ringed mb-2"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalProject',
              meta: {
                action: `/project/${project.id}?/edit`,
                title: 'Edit Project',
                data: project,
              },
            })}
        >
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  </div>
</div>

<div class="flex justify-between">
  <h1>Sessions</h1>
  <button
    class="btn btn-sm variant-filled mb-2"
    on:click={() =>
      modalStore.trigger({
        type: 'component',
        component: 'formModalProjectSession',
        meta: {
          action: `/project/${project.id}/session?/new`,
          title: 'New Session',
        },
      })}
  >
    <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
    <span>New Session</span>
  </button>
</div>
<hr />
<ul class="list">
  {#each project.sessions as session}
    <li class="card p-4 mb-4 {session.sent ? 'bg-green-50' : ''}">
      <div>
        <div class="flex w-full justify-between">
          <div>
            <h3 class="font-bold">
              {dayjs.tz(session.date, 'UTC').format('L')}
            </h3>
            <div class="text-green-400 font-bold">{session.sent ? 'Sent' : ''}</div>
          </div>
          <div>
            <button
              class="btn btn-sm variant-ringed mb-2"
              on:click={() =>
                modalStore.trigger({
                  type: 'component',
                  component: 'formModalProjectSession',
                  meta: {
                    action: `/project/${project.id}/session/${session.id}?/edit`,
                    title: 'Edit Session',
                    data: session,
                  },
                })}
            >
              <Icon icon="material-symbols:edit-outline" height="18" />
              <span>Edit</span>
            </button>
            <FormButton
              action={`/project/${project.id}/session/${session.id}?/delete`}
              class="btn btn-sm variant-ringed"
              onClick={confirmDelete}
            >
              <Icon icon="mdi:trash-outline" height="18" />
              Delete
            </FormButton>
          </div>
        </div>
        <div class="flex">
          {#if session.notes === null}
            <p class="text-gray-400">No notes</p>
          {:else}
            <p class="whitespace-pre-wrap w-full py-2">{session.notes || ''}</p>
          {/if}
        </div>
      </div>
    </li>
  {/each}
</ul>
