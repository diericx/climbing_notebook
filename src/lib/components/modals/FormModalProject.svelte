<script lang="ts">
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import FormProject from '../forms/FormProject.svelte';
  import FormModal from './FormModal.svelte';

  let submitting: boolean;
  let delayed: boolean;
</script>

<FormModal let:data let:action let:id>
  <span slot="content">
    <FormProject
      {data}
      {action}
      {id}
      bind:submitting
      bind:delayed
      showSubmitButton={false}
      onSuccess={() => {
        modalStore.close();
      }}
    />
  </span>
  <span slot="footer">
    <button class="relative btn variant-filled" form={id} disabled={delayed}>
      {#if delayed}
        <span class="absolute">
          <Icon class="text-xl" icon="line-md:loading-loop" />
        </span>
      {/if}
      <span class={delayed ? 'invisible' : ''}> Submit </span>
    </button>
  </span>
</FormModal>
