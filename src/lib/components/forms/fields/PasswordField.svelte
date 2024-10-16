<script lang="ts" generics="T extends Record<string, unknown>">
  import { camelToTitle } from '$lib/utils';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
  import { formFieldProxy } from 'sveltekit-superforms';

  export let form: SuperForm<T>;
  export let field: FormPathLeaves<T>;
  export let placeholder = '';

  const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<label>
  <span class="font-bold">{camelToTitle(String(path))}</span>
  <br />
  <input
    type="password"
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
