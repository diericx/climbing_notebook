<script lang="ts">
  import { camelToTitle } from '$lib/utils';
  import type { AutocompleteOption } from '@skeletonlabs/skeleton';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';
  import Autocomplete from './skeleton/Autocomplete.svelte';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<ZodValidation<T>, unknown>;
  export let field: FormPathLeaves<z.infer<T>>;
  export let label: string | undefined = undefined;
  export let options: AutocompleteOption[];

  const { path, value, errors } = formFieldProxy(form, field);

  let searchValue = '';
  let popupSettings: PopupSettings = {
    event: 'focus-click',
    target: 'popupAutocomplete',
    placement: 'bottom',
  };

  function onSelection(event: any): void {
    searchValue = event.detail.label;
    value.set(event.detail.value);
    searchValue = '';
  }
</script>

<label>
  <span class="font-bold">{label || camelToTitle(String(path))}</span>
  <br />
  {#if $errors}
    <div class="invalid">{$errors}</div>
  {/if}
  <slot name="pre" />
  <input
    class="autocomplete w-full"
    type="search"
    bind:value={searchValue}
    placeholder="Search..."
    use:popup={popupSettings}
    {...$$restProps}
  />
</label>

<div
  data-popup="popupAutocomplete"
  class="card w-full max-w-xs max-h-48 p-4 overflow-y-auto overflow-x-hidden z-50"
  tabindex="-1"
>
  <Autocomplete bind:input={searchValue} {options} on:selection={onSelection} />
</div>

<style lang="scss">
  .invalid {
    color: orangered;
  }
</style>
