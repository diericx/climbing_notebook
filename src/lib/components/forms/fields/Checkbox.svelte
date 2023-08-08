<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { z, AnyZodObject } from 'zod';
  import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import { camelToTitle } from '$lib/utils';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<ZodValidation<T>, unknown>;
  export let field: FormPathLeaves<z.infer<T>>;
  export let placeholder = '';
  export let label: string | undefined = undefined;

  const { path, value, errors, constraints } = formFieldProxy(form, field);
  $: boolValue = value as Writable<boolean>;
</script>

<label>
  <span class="font-bold">{label || camelToTitle(String(path))}</span>
  <br />
  <slot name="description" />
  <input
    type="checkbox"
    {placeholder}
    data-invalid={$errors}
    bind:checked={$boolValue}
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
