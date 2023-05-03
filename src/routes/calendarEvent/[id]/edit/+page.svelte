<script lang="ts">
	import FormCalendarEvent from '$lib/components/forms/FormCalendarEvent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: form = data.form;
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>Edit Calendar Event</h1>
		<FormCalendarEvent action="?/editCalendarEvent" data={form} />
	</div>
</div>
