<script lang="ts">
  import Icon from '@iconify/svelte';
  import { popup } from '@skeletonlabs/skeleton';
  import { v4 as uuidv4 } from 'uuid';
  const id = uuidv4();

  export let href: string = '';
  export let showElipses = true;
  let className: string = '';
  export { className as class };
</script>

<div class={`block bg-white rounded-md ${href === '' ? '' : 'card-hover'} border`}>
  <a
    style="height: 100%;"
    class={`flex flex-col justify-between p-4 ${className}`}
    href={href === '' ? undefined : href}
  >
    <div class="flex justify-between items-center">
      <div>
        <slot name="title" />
      </div>
      <div class={`flex ${showElipses ? '' : 'hidden'}`}>
        <div>
          <button
            class="btn !bg-transparent justify-between"
            use:popup={{
              event: 'click',
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
    <div class="h-full">
      <slot name="content" />
    </div>
  </a>
</div>

<div {id} data-popup={id}>
  <nav class="list-nav card shadow-xl py-2 relative">
    <ul>
      <slot name="popup-buttons" />
    </ul>
  </nav>
  <div class="arrow bg-white border" />
</div>
