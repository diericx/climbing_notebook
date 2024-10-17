<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Writable } from 'svelte/store';

  import { camelToTitle, roundTo } from '$lib/utils';
  import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
  import { formFieldProxy } from 'sveltekit-superforms';

  export let form: SuperForm<T>;
  export let field: FormPathLeaves<T>;
  export let placeholder = '';
  export let step = '1';
  export let shouldRound = false;
  export let roundFunc = (x: number) => roundTo(x, 1);
  export let label: string | undefined = undefined;
  export let shouldPerformUnitConversion = false;
  export let unitConversionFunc = (value: number) => value;
  export let unitDeconversionFunc = (value: number) => value;
  let className: string = '';
  export { className as class };

  const { path, value, errors, constraints } = formFieldProxy(form, field);
  $: numberValue = value as Writable<number>;

  // Account for any unit conversions
  let formValue = shouldPerformUnitConversion ? unitConversionFunc(Number($value)) : Number($value);
  if (shouldRound) {
    formValue = roundFunc(formValue);
  }

  $: {
    $numberValue = shouldPerformUnitConversion ? unitDeconversionFunc(formValue) : formValue;
  }
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
    bind:value={formValue}
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
