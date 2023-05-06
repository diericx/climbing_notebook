<script lang="ts">
	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;
	export let cols: number | undefined = undefined;
	export let rows: number | undefined = undefined;
	export let placeholder = '';
	let className: string = '';
	export { className as class };

	const { path, value, errors, constraints } = formFieldProxy(form, field);

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key == 'Tab') {
			let target = e.target as HTMLInputElement;
			e.preventDefault();
			var start = target.selectionStart;
			var end = target.selectionEnd;
			// If either start or end is null, this logic cannot be applied here
			// and it will be best to simply disable the key
			if (start == null || end == null) {
				return;
			}
			target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
		}
	};
</script>

<label>
	<span class="font-bold">{String(path)}</span>
	<br />
	<textarea
		class={className}
		{cols}
		{rows}
		on:keydown={onKeyDown}
		{placeholder}
		data-invalid={$errors}
		bind:value={$value}
		{...$$restProps}
	/>
</label>
<br />
{#if $errors}
	<span class="invalid">{$errors}</span>
	<br />
{/if}

<style lang="scss">
	.invalid {
		color: orangered;
	}
</style>
