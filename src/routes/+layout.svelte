<script lang="ts">
	import type { PageData } from './$types';
	import NProgress from 'nprogress';
	import { AppBar, AppShell, Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// import '@event-calendar/core/index.css';
	import 'nprogress/nprogress.css';
	import './styles.css';
	import '../app.css';
	import { navigating } from '$app/stores';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import FormModalExerciseEvent from '$lib/components/modals/FormModalExerciseEvent.svelte';
	import FormModalExerciseGroup from '$lib/components/modals/FormModalExerciseGroup.svelte';
	import FormModalTrainingProgram from '$lib/components/modals/FormModalTrainingProgram.svelte';
	import FormModalTrainingProgramDay from '$lib/components/modals/FormModalTrainingProgramDay.svelte';
	import FormModalCalendarEvent from '$lib/components/modals/FormModalCalendarEvent.svelte';
	import ModalCalendarEvent from '$lib/components/modals/ModalCalendarEvent.svelte';
	import ModalJournalEntry from '$lib/components/modals/ModalJournalEntry.svelte';
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import FormModalCustomQuery from '$lib/components/modals/FormModalCustomQuery.svelte';
	import FormModalCustomQueryCondition from '$lib/components/modals/FormModalCustomQueryCondition.svelte';
	import FormModalWidget from '$lib/components/modals/FormModalWidget.svelte';
	import FormModalDataset from '$lib/components/modals/FormModalDataset.svelte';
	import ModalShareTrainingProgram from '$lib/components/modals/ModalShareTrainingProgram.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

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

	const modalComponentRegistry: Record<string, ModalComponent> = {
		formModalExerciseEvent: { ref: FormModalExerciseEvent },
		formModalExerciseGroup: { ref: FormModalExerciseGroup },
		formModalTrainingProgram: { ref: FormModalTrainingProgram },
		formModalTrainingProgramDay: { ref: FormModalTrainingProgramDay },
		formModalCalendarEvent: { ref: FormModalCalendarEvent },
		formModalCustomQuery: { ref: FormModalCustomQuery },
		formModalCustomQueryCondition: { ref: FormModalCustomQueryCondition },
		formModalWidget: { ref: FormModalWidget },
		formModalDataset: { ref: FormModalDataset },
		modalCalendarEvent: { ref: ModalCalendarEvent },
		modalJournalEntry: { ref: ModalJournalEntry },
		modalShareTrainingProgram: { ref: ModalShareTrainingProgram }
	};
	function drawerOpen(): void {
		drawerStore.open({});
	}
	function drawerClose(): void {
		drawerStore.close();
	}

	let popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'combobox',
		placement: 'bottom-end',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

	let menuItems = [
		{ title: 'Home', url: '/' },
		{ title: 'Journal', url: '/journalEntry' },
		{ title: 'Exercise Log', url: '/exerciseEvent' },
		{ title: 'Training Programs', url: '/trainingProgram' },
		{ title: 'Feedback', url: '/feedback' },
		{ title: 'Queries', url: '/query' }
	];
</script>

<Modal components={modalComponentRegistry} />
<Drawer bgDrawer="bg-white">
	<nav class="list-nav p-4">
		<ul>
			{#each menuItems as item}
				<li>
					<a on:click={drawerClose} class="btn hover:variant-soft-primary" href={item.url}>
						{item.title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<AppBar background="bg-white">
			<svelte:fragment slot="lead">
				<button class="md:hidden btn btn-sm mr-4" on:click={drawerOpen}>
					<span>
						<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
							<rect width="100" height="20" />
							<rect y="30" width="100" height="20" />
							<rect y="60" width="100" height="20" />
						</svg>
					</span>
				</button>
				<a href="/" class="flex items-center">
					<span
						style="line-height: 20px"
						class="self-center text-xl font-semibold whitespace-nowrap text-gray-800"
						>Climbing <br />Notebook</span
					>
				</a>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<div class="hidden md:block w-full flex-grow">
					{#each menuItems as item}
						<a class="px-2 text-gray-600 hover:text-black font-light" href={item.url}>
							{item.title}
						</a>
					{/each}
				</div>

				{#if data.user != undefined}
					<div>
						<button class="p-1" use:popup={popupCombobox}>
							<Icon icon="iconamoon:profile-circle-fill" height="28" />
						</button>
					</div>
					<!-- AUTH POPUP  -->
					<div class="card w-48 shadow-xl py-2" data-popup="combobox">
						<nav class="list-nav">
							<ul>
								<li>
									<a href="/profile"> Profile </a>
								</li>
								<li>
									<form method="POST" action="/?/signout">
										<button class="w-full" style="margin-top: 0px">Logout</button>
									</form>
								</li>
							</ul>
						</nav>
						<div class="arrow bg-surface-100-800-token" />
					</div>
				{:else}
					<a class="px-2 text-gray-600 hover:text-black font-light" href="/login"> Login </a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="container mx-auto px-3">
		<main class="pt-8">
			<slot />
		</main>
	</div>
</AppShell>
