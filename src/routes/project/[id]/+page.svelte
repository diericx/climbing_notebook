<script lang="ts">
  import type { PageData } from './$types';
  import Icon from '@iconify/svelte';
  import { FileDropzone, modalStore } from '@skeletonlabs/skeleton';
  import { enhance } from '$app/forms';
  import { confirmDelete } from '$lib/utils';
  import Image from '$lib/components/Image.svelte';
  import FormBodyFileUpload from '$lib/components/forms/bodies/FormBodyFileUpload.svelte';
  import Form from '$lib/components/forms/Form.svelte';
  import { fileUploadSchema } from '$lib/file';
  export let data: PageData;

  $: s3ObjectUrls = data.s3ObjectUrls;
  $: s3ObjectMetadatas = data.s3ObjectMetadatas;
  $: project = data.project;
</script>

<div class="mb-4">
  <div class="flex justify-between">
    <div>
      <h1>{project.name}</h1>
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
  <hr />
  <p>
    <b>Grade:</b>
    {project.gradeSystem == 'font' ? project.fontGrade : ''}
    {project.gradeSystem == 'hueco' ? project.huecoGrade : ''}
  </p>
  <b>Image</b>
  {#if project.imageS3ObjectKey}
    <form
      use:enhance
      method="POST"
      action={`/project/${project.id}?/deleteImage`}
      class="flex-initial"
    >
      <input type="hidden" name="key" value={project.imageS3ObjectKey} />
      <button on:click={confirmDelete} class="btn btn-sm variant-ringed">
        <Icon icon="mdi:trash-outline" height="18" />
        <span class="ml-1 mr-1"> Delete Image </span>
      </button>
    </form>
    <Image
      src={s3ObjectUrls[project.imageS3ObjectKey]}
      width={s3ObjectMetadatas[project.imageS3ObjectKey]?.width || '0'}
      height={s3ObjectMetadatas[project.imageS3ObjectKey]?.height || '0'}
      class={'max-h-96'}
    />
  {:else}
    <Form schema={fileUploadSchema} let:superForm action={`/project/${project.id}?/uploadImage`}>
      <FormBodyFileUpload label="" {superForm} />
    </Form>
  {/if}
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
            <h3 class="font-bold">{new Date(session.date).toLocaleDateString('en-US')}</h3>
            <div class="text-gray-400">{session.sent ? 'Sent' : ''}</div>
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
              <span>Edit Session</span>
            </button>
            <form
              method="POST"
              action={`/project/${project.id}/session/${session.id}?/delete`}
              class="inline"
              use:enhance
            >
              <button class="btn btn-sm variant-ringed" on:click={confirmDelete}>
                <Icon icon="mdi:trash-outline" height="18" />
                Delete
              </button>
            </form>
          </div>
        </div>
        <div class="flex">
          <p class="whitespace-pre-wrap w-full py-2">{session.notes || ''}</p>
        </div>
      </div>
    </li>
  {/each}
</ul>
