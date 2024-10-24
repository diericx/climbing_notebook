<script lang="ts">
  import Image from '$lib/components/Image.svelte';
  import Form from '$lib/components/forms/Form.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import FormBodyFileUpload from '$lib/components/forms/bodies/FormBodyFileUpload.svelte';
  import { confirmDelete } from '$lib/utils';
  import { fileUploadSchema } from '$lib/zodSchemas';
  import Icon from '@iconify/svelte';
  import { json2csv } from 'json-2-csv';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ profile, user, metrics, exerciseEvents, journalEntries, s3ObjectMetadatas, s3ObjectUrls } =
    data);

  function downloadAsJson(resources: any, name: string) {
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(
      new Blob([JSON.stringify(resources)], { type: 'text/json' }),
    );
    a.download = name + '.json';

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }

  async function downloadAsCsv(resources: any, name: string) {
    const csv = await json2csv(resources);
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = name + '.csv';

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }
</script>

<h1>Account Info</h1>
<hr />
<p><b>Username: </b> {user?.username}</p>
<p><b>Email: </b> {user?.email}</p>

<br />

<h1>Profile Picture</h1>
<hr />

{#if profile.imageS3ObjectKey}
  <div class="">
    <Image
      src={s3ObjectUrls[profile.imageS3ObjectKey]}
      width={s3ObjectMetadatas[profile.imageS3ObjectKey]?.width || '0'}
      height={s3ObjectMetadatas[profile.imageS3ObjectKey]?.height || '0'}
      class={'max-h-96 mb-2'}
    />
    <FormButton
      action={`/profile?/deleteImage`}
      class="btn btn-sm variant-ringed"
      onClick={confirmDelete}
    >
      <slot name="form">
        <input type="hidden" name="key" value={profile.imageS3ObjectKey} />
      </slot>
      <Icon icon="mdi:trash-outline" height="18" />
      <span class="ml-1 mr-1"> Delete Profile Image </span>
    </FormButton>
  </div>
{:else}
  <Form
    schema={fileUploadSchema}
    let:superForm
    action={`/profile?/uploadImage`}
    enctype="multipart/form-data"
  >
    <FormBodyFileUpload class="w-60" label="" {superForm} />
  </Form>
{/if}
<br />

<div>
  <div class="flex flex-wrap mb-2 justify-between items-center">
    <div>
      <h1 class="inline">Profile</h1>
    </div>
    <div>
      <a class="btn btn-sm variant-ringed" href={`/profile/edit?redirectTo=/profile`}>
        <Icon icon="material-symbols:edit-outline" height="18" />
        <span> Edit </span>
      </a>
    </div>
  </div>
  <hr />

  <p><b>Weight Unit: </b>{profile.weightUnit == 'kg' ? 'Kilograms' : 'Pounds'}</p>

  <b>Goals: </b>

  <div class="whitespace-pre bg-white w-full px-1 py-3 rounded">
    {profile?.goals}
  </div>
</div>

<br />

<div class="flex flex-wrap mb-4 justify-between items-center">
  <div>
    <h1 class="inline">Data Exporter</h1>
  </div>
</div>
<hr />

<div class="mb-2">
  <button
    class="btn variant-filled"
    on:click={() => downloadAsJson(exerciseEvents, 'exerciseEvents')}
    >Download Exercise Event Data as JSON</button
  >
  <button
    class="btn variant-filled"
    on:click={() => downloadAsCsv(exerciseEvents, 'exerciseEvents')}
    >Download Exercise Event Data as CSV</button
  >
</div>

<div class="mb-2">
  <button
    class="btn variant-filled"
    on:click={() => downloadAsJson(journalEntries, 'journalEntries')}
    >Download Journal Data as JSON</button
  >
  <button
    class="btn variant-filled"
    on:click={() => downloadAsCsv(journalEntries, 'journalEntries')}
    >Download Journal Data as CSV</button
  >
</div>

<div class="mb-2">
  <button class="btn variant-filled" on:click={() => downloadAsJson(metrics, 'metrics')}
    >Download Metrics Data as JSON</button
  >
  <button class="btn variant-filled" on:click={() => downloadAsCsv(metrics, 'metrics')}
    >Download Metrics Data as CSV</button
  >
</div>
