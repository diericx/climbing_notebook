<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { v4 as uuidv4 } from 'uuid';

	let id = uuidv4();

	let title = $modalStore[0]?.meta?.title;
	let data = $modalStore[0]?.meta?.data;
	let action = $modalStore[0]?.meta?.action;
</script>

<div style="max-height: 90vh" class="card w-modal">
	<header class="card-header">
		<h2 class="font-bold">{title}</h2>
	</header>
	<div style="max-height: 80vh" class="overflow-scroll">
		<section class="p-4 overflow-scroll">
			<slot name="content" {action} {data} {id} />
		</section>
		<footer class="card-footer float-right space-x-4">
			<button class="btn variant-ghost-surface" on:click={() => modalStore.close()}>Cancel</button>
			<slot name="footer" {id} {action} {data} />
		</footer>
	</div>
</div>
