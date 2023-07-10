<script lang="ts">
  import { camelToTitle } from '$lib/utils';
  import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
  import { dateProxy, type SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import type { z, AnyZodObject } from 'zod';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<UnwrapEffects<T>, unknown>;
  export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;
  export let placeholder = '';

  const { path, errors, constraints } = formFieldProxy(form, field);
  const dateValue = dateProxy(form.form, field, {
    format: 'date',
  });
</script>

<label>
  <span class="font-bold">{camelToTitle(String(path))}</span>
  <br />
  <input
    type="date"
    {placeholder}
    data-invalid={$errors}
    bind:value={$dateValue}
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
