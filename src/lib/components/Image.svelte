<script lang="ts">
  import Icon from '@iconify/svelte';

  export let src: string;
  export let width: string;
  export let height: string;
  let className: string;
  export { className as class };

  let loading = true;

  const createLoadObserver = (handler) => {
    let waiting = 0;

    const onload = (el) => {
      waiting++;
      el.addEventListener('load', () => {
        waiting--;
        if (waiting === 0) {
          handler();
        }
      });
    };

    return onload;
  };

  const onload = createLoadObserver(() => {
    loading = false;
  });
</script>

<div class={`card bg-gray-200 w-fit loading`}>
  <img
    class={`${loading ? 'invisible' : ''} object-contain w-auto card ${className}`}
    use:onload
    {src}
    alt={src}
    {width}
    {height}
  />
</div>
