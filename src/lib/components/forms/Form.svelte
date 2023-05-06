<script lang="ts">
	import { page } from '$app/stores';
	import { assignDefined } from '$lib/utils';
	import { defaultData, superForm } from 'sveltekit-superforms/client';
	import type { z, ZodRawShape } from 'zod';

	export let schema: z.ZodObject<ZodRawShape>;
	export let data: any = {};
	export let id = crypto.randomUUID();
	export let onSuccess: (() => Promise<void>) | undefined = undefined;
	export let action = '?/newCalendarEvent';

	// Add redirect data
	if ($page.url.searchParams.has('redirectTo')) {
		action += '&redirectTo=' + $page.url.searchParams.get('redirectTo');
	}

	let formData: z.infer<typeof schema> = assignDefined(defaultData(schema), data || {});
	const newSuperForm = superForm(formData, {
		resetForm: false,
		id,
		onResult({ result }) {
			if (result.type == 'success' && onSuccess != undefined) {
				onSuccess();
			}
		}
	});
	const { enhance } = newSuperForm;
</script>

<form method="POST" {action} use:enhance {id}>
	<input type="hidden" name="_formId" value={id} />
	<slot form={newSuperForm} />
</form>
