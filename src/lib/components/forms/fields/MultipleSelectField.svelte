<script lang="ts">
  import { camelToTitle } from '$lib/utils';
  import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import type { z, AnyZodObject } from 'zod';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<UnwrapEffects<T>, unknown>;
  export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;
  export let label: string | undefined = undefined;
  export let options: string[];

  const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<label>
  <span class="font-bold">{label || camelToTitle(String(path))}</span>
  <slot name="description" />
</label>
{#each options as option}
  <label class="text-black">
    <input type="checkbox" bind:group={$value} value={option} {...$$restProps} />
    {option}
  </label>
{/each}
{#if $errors}
  <div class="invalid">{$errors}</div>
{/if}

<style lang="scss">
  .invalid {
    color: orangered;
  }
</style>
