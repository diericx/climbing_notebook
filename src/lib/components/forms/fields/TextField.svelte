<script lang="ts">
	import { camelToTitle } from '$lib/utils';
	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;
	export let placeholder = '';
	export let label: string | undefined = undefined;

	const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<label>
	<span class="font-bold">{label || camelToTitle(String(path))}</span>
	<br />
	<slot name="description" />
	<input
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
