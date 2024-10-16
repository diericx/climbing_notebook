<script lang="ts" generics="T extends Record<string, unknown>">
  import { camelToTitle } from '$lib/utils';
  import type { AutocompleteOption } from '@skeletonlabs/skeleton';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import type { FormPathLeaves } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import Autocomplete from './skeleton/Autocomplete.svelte';

  export let form: SuperForm<T>;
  export let field: FormPathLeaves<T>;
  export let label: string | undefined = undefined;
  export let options: AutocompleteOption[];
  export let searchValue = '';

  const { path, value, errors } = formFieldProxy(form, field);

  let popupSettings: PopupSettings = {
    event: 'click',
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
    on:keyup
    placeholder="Type to Search..."
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
