<script lang="ts" generics="T extends Record<string, unknown>">
  import { camelToTitle } from '$lib/utils';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
  import { dateProxy, formFieldProxy } from 'sveltekit-superforms';

  export let form: SuperForm<T>;
  export let field: FormPathLeaves<T>;
  export let placeholder = '';

  const { value, path, errors, constraints } = formFieldProxy(form, field);
  const dateValue = dateProxy(form.form, field, {
    format: 'date',
  });

  // TODO: this is a hack to get around the fact that we are not parsing input from API calls
  // to typed variables or rich objects or going through zod. That would be the root cause solution.
  if (typeof $value == 'string') {
    // @ts-ignore
    $value = new Date($value);
  }
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
