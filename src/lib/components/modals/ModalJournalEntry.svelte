<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { JournalEntry } from '@prisma/client';
	let journalEntry = $modalStore[0]?.meta?.data as JournalEntry;
</script>

<div class="card w-modal">
	<header class="card-header">
		<h3 class="font-bold">Journal Entry</h3>
	</header>
	<section class="p-4">
		<h4>
			{new Date(journalEntry?.date || '').toLocaleDateString('en-US') || ''}
		</h4>
		<p class="whitespace-pre-wrap">{journalEntry?.content || ''}</p>
	</section>
	<footer class="card-footer float-right space-x-4">
		<button class="btn variant-ghost-surface" on:click={modalStore.close}>Cancel</button>
		<a href={`/journalEntry/${journalEntry?.id || undefined}/edit?redirectTo=/`}>
			<button class="btn variant-filled" on:click={modalStore.close}>Edit</button>
		</a>
	</footer>
</div>
