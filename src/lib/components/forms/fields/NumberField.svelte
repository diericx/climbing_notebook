<script lang="ts">
  import { camelToTitle } from '$lib/utils';
  import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<ZodValidation<T>, unknown>;
  export let field: FormPathLeaves<z.infer<T>>;
  export let placeholder = '';
  export let step = '1';
  export let label: string | undefined = undefined;
  let className: string = '';
  export { className as class };

  const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<label>
  <span class="font-bold">{label || camelToTitle(String(path))}</span>
  <br />
  <input
    type="number"
    class={className}
    {placeholder}
    {step}
    data-invalid={$errors}
    bind:value={$value}
    {...$constraints}
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
