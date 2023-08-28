<script lang="ts">
  import Icon from '@iconify/svelte';
  import { popup } from '@skeletonlabs/skeleton';
  import { v4 as uuidv4 } from 'uuid';
  const id = uuidv4();

  export let href: string;
  export let showElipses = true;
</script>

<div class="block card card-hover">
  <a style="height: 100%;" class="flex flex-col justify-between" {href}>
    <div class="flex justify-between items-center">
      <div class="my-4 mx-4">
        <slot name="content" />
      </div>
      <div class={`flex ${showElipses ? '' : 'hidden'}`}>
        <div>
          <button
            class="btn !bg-transparent justify-between"
            use:popup={{
              event: 'focus-click',
              target: id,
              placement: 'bottom-end',
            }}
            on:click={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Icon icon="fe:elipsis-h" height="18" />
          </button>
        </div>
      </div>
    </div>
  </a>
</div>

<div {id} class="card shadow-xl py-2" data-popup={id}>
  <nav class="list-nav">
    <ul>
      <slot name="popup-buttons" />
    </ul>
  </nav>
  <div class="arrow bg-surface-100-800-token" />
</div>
