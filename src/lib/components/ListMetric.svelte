<script lang="ts">
	import type { Metric } from '@prisma/client';

	export let metrics: Metric[];
</script>

<ul class="divide-y divide-gray-200 border">
	{#each metrics as metric}
		<li class="bg-white py-2 px-2">
			<div class="flex items-center md:space-x-3">
				<div class="flex-1 min-w-0">
					<p>{metric.name}</p>
					<p class="text-sm text-gray-400">
						{metric.value}
					</p>
				</div>
				<div class="flex min-w-0 float-right space-x-2" />
			</div>
		</li>
	{/each}
</ul>

{#if metrics.length == 0}
	<span class="italic text-gray-400">No metrics</span>
{/if}
