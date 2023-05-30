<script lang="ts">
	import { page } from '$app/stores';
	import { assignDefined } from '$lib/utils';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import type { z, ZodRawShape } from 'zod';

	export let schema: z.ZodObject<ZodRawShape>;
	export let data: any = {};
	export let id: string;
	export let onSuccess: (() => void) | undefined = undefined;
	export let action = '';
	export let resetForm = false;

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData: z.infer<typeof schema> = assignDefined(defaultData(schema), data || {});
	const newSuperForm = superForm(formData, {
		resetForm,
		applyAction: true,
		invalidateAll: true,
		id,
		dataType: 'json',
		onResult({ result }) {
			if ((result.type == 'success' || result.type == 'redirect') && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { enhance, message } = newSuperForm;
</script>

{#if $message}
	<div class="invalid">{$message}</div>
{/if}
<form method="POST" {action} use:enhance {id} class="form">
	<input type="hidden" name="_formId" value={id} />
	<slot form={newSuperForm} />
</form>
