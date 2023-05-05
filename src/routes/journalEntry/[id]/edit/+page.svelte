<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	import FormJournalEntry from '$lib/components/forms/FormJournalEntry.svelte';

	export let data: PageData;
</script>

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>Edit Journal Entry</h2>
		<FormJournalEntry action="?/editJournalEntry" form={data.form} />
	</div>
</div>
