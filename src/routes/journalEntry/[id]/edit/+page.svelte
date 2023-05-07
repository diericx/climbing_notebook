<script lang="ts">
	import type { PageData } from './$types';

	import FormJournalEntry from '$lib/components/forms/FormJournalEntry.svelte';

	export let data: PageData;
	$: journalEntry = data.journalEntry;
</script>

<div class="grid grid-cols-1">
	<div>
		<h2>Edit Journal Entry</h2>
		<FormJournalEntry action="?/editJournalEntry" data={journalEntry} />
	</div>
</div>
