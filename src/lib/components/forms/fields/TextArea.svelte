<script lang="ts" generics="T extends Record<string, unknown>">
  import { camelToTitle } from '$lib/utils';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
  import { formFieldProxy } from 'sveltekit-superforms';

  export let form: SuperForm<T>;
  export let field: FormPathLeaves<T>;
  export let cols: number | undefined = undefined;
  export let rows: number | undefined = undefined;
  export let placeholder = '';
  let className: string = '';
  export { className as class };

  const { path, value, errors, constraints } = formFieldProxy(form, field);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key == 'Tab') {
      let target = e.target as HTMLInputElement;
      e.preventDefault();
      var start = target.selectionStart;
      var end = target.selectionEnd;
      // If either start or end is null, this logic cannot be applied here
      // and it will be best to simply disable the key
      if (start == null || end == null) {
        return;
      }
      target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
    }
  };
</script>

<label>
  <span class="font-bold">{camelToTitle(String(path))}</span>
  <br />
  <slot />
  <textarea
    class={className}
    {cols}
    {rows}
    on:keydown={onKeyDown}
    {placeholder}
    {...$constraints}
    data-invalid={$errors}
    bind:value={$value}
    {...$$restProps}
  />
</label>
{#if $errors}
  <div class="invalid">{$errors}</div>
{/if}

<style lang="scss">
  .invalid {
    color: orangered;
  }
</style>
