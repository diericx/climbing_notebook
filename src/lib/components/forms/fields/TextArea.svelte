<script lang="ts">
  import { camelToTitle } from '$lib/utils';
  import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<ZodValidation<T>, unknown>;
  export let field: FormPathLeaves<z.infer<T>>;
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
