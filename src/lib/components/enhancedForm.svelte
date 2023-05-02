<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let id = crypto.randomUUID();

	// Form action to execute
	export let action = '';

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	// Form data is passed in, but this reference is only used for setting. The expectation
	// is that the caller will provide the form data to the fields via the slot.
	export let formData: any = {};
	export let formDataDefaults: any = {};
	export let onSuccess: (() => void) | undefined = undefined;

	// Assign defaults on mount
	onMount(async () => {
		formData = { ...formDataDefaults };
	});

	// If the formData variable coming in is undefined, set it to the defaults
	$: {
		if (formData == undefined) {
			formData = { ...formDataDefaults };
		}
	}
</script>

<form
	method="POST"
	{action}
	{id}
	use:enhance={() => {
		return async ({ result, update }) => {
			await update({ reset: false });
			// reset to defaults on success
			if (result.type == 'success') {
				formData = { ...formDataDefaults };
				if (onSuccess != undefined) {
					onSuccess();
				}
			}
		};
	}}
>
	<slot />
</form>
