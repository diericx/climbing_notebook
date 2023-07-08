<script lang="ts">
	export let src: string;
	let loading = true;

	const createLoadObserver = (handler) => {
		let waiting = 0;

		const onload = (el) => {
			waiting++;
			el.addEventListener('load', () => {
				waiting--;
				if (waiting === 0) {
					handler();
				}
			});
		};

		return onload;
	};

	const onload = createLoadObserver(() => {
		loading = false;
		console.log('on load...');
	});
</script>

<img class={loading ? 'invisible' : ''} use:onload {src} alt={src} />
{#if loading}
	<slot />
{/if}
