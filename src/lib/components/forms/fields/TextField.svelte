<script lang="ts" generics="T extends Record<string, unknown>">
  import { camelToTitle } from '$lib/utils';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
  import { formFieldProxy } from 'sveltekit-superforms';

  export let form: SuperForm<T>;
  export let field: FormPathLeaves<T>;
  export let placeholder = '';
  export let label: string | undefined = undefined;

  const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<label>
  <span class="font-bold">{label || camelToTitle(String(path))}</span>
  <br />
  <slot name="description" />
  <input
    name={field}
    type="text"
    {placeholder}
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
