<script lang="ts">
	import type { JournalEntry } from '@prisma/client';
	import Modal from '$lib/components/modals/Modal.svelte';

	export let showModal = false;
	export let journalEntry: JournalEntry | undefined = undefined;
</script>

<Modal bind:showModal>
	<h2 class="font-bold">
		{new Date(journalEntry?.date || '').toLocaleDateString('en-US') || ''}
	</h2>
	<p class="whitespace-pre-wrap">{journalEntry?.content || ''}</p>
	<div slot="buttons">
		<a href={`/journalEntry/${journalEntry?.id || undefined}/edit?redirectTo=/`}>
			<button class="inline-flex">Edit</button>
		</a>
	</div>
</Modal>
