<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	let id = crypto.randomUUID();

	let title = $modalStore[0]?.meta?.title;
	let data = $modalStore[0]?.meta?.data;
	let action = $modalStore[0]?.meta?.action;
</script>

<div style="max-height: 90vh" class="card w-modal">
	<header class="card-header">
		<h2 class="font-bold">{title}</h2>
	</header>
	<section style="height: auto" class="p-4 overflow-scroll">
		<slot name="content" {action} {data} {id} />
	</section>
	<footer class="card-footer float-right space-x-4">
		<button class="btn variant-ghost-surface" on:click={() => modalStore.close()}>Cancel</button>
		<slot name="footer" {id} {action} {data} />
	</footer>
</div>
