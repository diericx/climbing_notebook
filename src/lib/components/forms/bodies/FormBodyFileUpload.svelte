<script lang="ts">
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import Icon from '@iconify/svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let label = 'Files';

  // Bound to the file picker
  let files: FileList;

  const { errors } = superForm;
</script>

<label for="file" class="font-bold"> {label} </label>
<!-- Files are not handled by SuperForms so all errors are sent manually to 'file'-->
{#if $errors.file}<span class="invalid">{$errors.file}</span>{/if}

<FileDropzone name="file" bind:files>
  <svelte:fragment slot="lead">
    {#if !files || files.length == 0}
      <div class="flex justify-center">
        <Icon icon="mingcute:file-upload-fill" height="50" />
      </div>
    {:else}
      <div class="flex justify-center">
        <Icon icon="bi:image" height="50" />
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="message">
    {#if !files || files.length == 0}
      <b>Upload an image </b> or drag and drop
    {:else}
      {files[0].name}
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="meta">
    {#if !files || files.length == 0}
      JPG and PNG allowed
    {/if}</svelte:fragment
  >
</FileDropzone>

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
