<script lang="ts">
	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;

	const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<label>
	<span class="font-bold">{String(path)}</span>
	<br />
	<select bind:value={$value} data-invalid={$errors} {...$constraints} {...$$restProps}>
		<slot />
	</select>
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
