<script lang="ts" generics="T extends Record<string, unknown>">
  import { camelToTitle } from '$lib/utils';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
  import { dateProxy, formFieldProxy } from 'sveltekit-superforms';

  export let form: SuperForm<T>;
  export let field: FormPathLeaves<T>;
  export let placeholder = '';

  const { value, path, errors, constraints } = formFieldProxy(form, field);
  // This can be confusing, but we are editing with local time so the editor makes
  // logical sense to the user, but this date is sent directly to the server and is
  // stored as is in the UTC time zone.
  const dateValue = dateProxy(form.form, field, {
    format: 'date',
  });

  // TODO: this is a hack to get around the fact that we are not parsing input from API calls
  // to typed variables or rich objects or going through zod. That would be the root cause solution.
  if (typeof $value == 'string') {
    // @ts-ignore
    $value = new Date($value);
  }

  // Clean the date by erasing all time value as this is only a Date field not a DateTime field
  $value.setUTCHours(0, 0, 0, 0);
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
