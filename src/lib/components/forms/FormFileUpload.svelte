<script lang="ts">
  import { journalEntrySchema } from '$lib/journalEntry';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import Form from './Form.svelte';
  import { v4 as uuidv4 } from 'uuid';
  import Icon from '@iconify/svelte';

  // Form action to execute
  export let action = '';
  export let onSuccess: (() => void) | undefined = undefined;
  export let id = uuidv4();
  export let showSubmitButton = true;
  export let label = 'Files';

  // These are two way bindings from form values so the Modals can access
  export let submitting: boolean = false;
  export let delayed: boolean = false;

  // Bound to the file picker
  let files: FileList;
</script>

<Form
  schema={journalEntrySchema}
  {action}
  {id}
  {onSuccess}
  bind:submitting
  bind:delayed
  resetForm={true}
  let:form
  let:formData
  let:errors
>
  <input type="hidden" name="_formId" value={id} />

  <label for="file" class="font-bold"> {label} </label>
  {#if errors.file}<span class="invalid">{errors.file}</span>{/if}

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
    <button class="relative btn variant-filled mt-2" form={id} disabled={delayed}>
      {#if delayed}
        <span class="absolute">
          <Icon class="text-xl" icon="line-md:loading-loop" />
        </span>
      {/if}
      <span class={delayed ? 'invisible' : ''}> Upload </span>
    </button>
  {/if}
</Form>
