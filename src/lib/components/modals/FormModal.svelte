<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	let id = crypto.randomUUID();

	let title = $modalStore[0]?.meta?.title;
	let data = $modalStore[0]?.meta?.data;
	let action = $modalStore[0]?.meta?.action;
</script>

<div class="card">
	<header class="card-header">
		<h3 class="font-bold">{title}</h3>
	</header>
	<section class="p-4">
		<slot name="content" {action} {data} {id} />
	</section>
	<footer class="card-footer float-right space-x-4">
		<button type="submit" class="btn variant-ghost-surface" form={id}>Cancel</button>
		<slot name="footer" />
	</footer>
</div>
