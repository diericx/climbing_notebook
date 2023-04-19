<script lang="ts">
	import NProgress from 'nprogress';
	import Header from './Header.svelte';
	import './styles.css';
	import '../app.css';
	import { navigating } from '$app/stores';
	import type { PageData } from './$types';
	// NProgress css
	import 'nprogress/nprogress.css';

	export let data: PageData;

	NProgress.configure({
		minimum: 0.16
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}
</script>

<div class="app">
	<Header user={data.user} />

	<div class="container mx-auto">
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	.app {
		min-height: 100vh;
	}
</style>
