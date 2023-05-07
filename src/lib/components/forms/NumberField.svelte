<script lang="ts">
	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;
	export let placeholder = '';
	export let step = '1';
	let className: string = '';
	export { className as class };

	const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<label>
	<span class="font-bold">{String(path)}</span>
	<br />
	<input
		type="number"
		class={className}
		{placeholder}
		{step}
		data-invalid={$errors}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
</label>
<br />
{#if $errors}
	<div class="invalid">{$errors}</div>
{/if}

<style lang="scss">
	.invalid {
		color: orangered;
	}
</style>
