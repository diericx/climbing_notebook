<script lang="ts">
  import { AppBar, AppShell, Modal, Toast, type ModalComponent } from '@skeletonlabs/skeleton';
  import NProgress from 'nprogress';
  import type { PageData } from './$types';
  // Your selected Skeleton theme:
  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
  // This contains the bulk of Skeletons required styles:
  import { navigating, page } from '$app/stores';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import ModalCalendarEvent from '$lib/components/modals/ModalCalendarEvent.svelte';
  import ModalJournalEntry from '$lib/components/modals/ModalJournalEntry.svelte';
  import ModalShareTrainingCycle from '$lib/components/modals/ModalShareTrainingCycle.svelte';
  import ModalShareTrainingProgram from '$lib/components/modals/ModalShareTrainingProgram.svelte';
  import FormModalCalendarEvent from '$lib/components/modals/formModals/FormModalCalendarEvent.svelte';
  import FormModalCustomQuery from '$lib/components/modals/formModals/FormModalCustomQuery.svelte';
  import FormModalCustomQueryCondition from '$lib/components/modals/formModals/FormModalCustomQueryCondition.svelte';
  import FormModalDataset from '$lib/components/modals/formModals/FormModalDataset.svelte';
  import FormModalExercise from '$lib/components/modals/formModals/FormModalExercise.svelte';
  import FormModalExerciseEvent from '$lib/components/modals/formModals/FormModalExerciseEvent.svelte';
  import FormModalExerciseGroup from '$lib/components/modals/formModals/FormModalExerciseGroup.svelte';
  import FormModalProject from '$lib/components/modals/formModals/FormModalProject.svelte';
  import FormModalProjectSession from '$lib/components/modals/formModals/FormModalProjectSession.svelte';
  import FormModalTrainingCycle from '$lib/components/modals/formModals/FormModalTrainingCycle.svelte';
  import FormModalTrainingCycleDay from '$lib/components/modals/formModals/FormModalTrainingCycleDay.svelte';
  import FormModalTrainingCycleTemplate from '$lib/components/modals/formModals/FormModalTrainingCycleTemplate.svelte';
  import FormModalTrainingProgram from '$lib/components/modals/formModals/FormModalTrainingProgram.svelte';
  import FormModalTrainingProgramActivation from '$lib/components/modals/formModals/FormModalTrainingProgramActivation.svelte';
  import FormModalTrainingProgramScheduledSlot from '$lib/components/modals/formModals/FormModalTrainingProgramScheduledSlot.svelte';
  import FormModalWidget from '$lib/components/modals/formModals/FormModalWidget.svelte';
  import FormModalWidgetTemplate from '$lib/components/modals/formModals/FormModalWidgetTemplate.svelte';
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import Icon from '@iconify/svelte';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import { Drawer, drawerStore, popup, storePopup } from '@skeletonlabs/skeleton';
  import '@skeletonlabs/skeleton/styles/skeleton.css';
  import 'nprogress/nprogress.css';
  import { Breadcrumbs } from 'svelte-breadcrumbs';
  import { getFlash } from 'sveltekit-flash-message';
  import '../app.css';

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  export let data: PageData;
  $: countOfExercisesThatNeedMigration = data.countOfExercisesThatNeedMigration;

  const flash = getFlash(page);

  NProgress.configure({
    minimum: 0.16,
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
    formModalTrainingCycle: { ref: FormModalTrainingCycle },
    formModalTrainingCycleDay: { ref: FormModalTrainingCycleDay },
    formModalCalendarEvent: { ref: FormModalCalendarEvent },
    formModalCustomQuery: { ref: FormModalCustomQuery },
    formModalCustomQueryCondition: { ref: FormModalCustomQueryCondition },
    formModalWidget: { ref: FormModalWidget },
    formModalWidgetTemplate: { ref: FormModalWidgetTemplate },
    formModalDataset: { ref: FormModalDataset },
    formModalProject: { ref: FormModalProject },
    formModalProjectSession: { ref: FormModalProjectSession },
    formModalExercise: { ref: FormModalExercise },
    formModalTrainingProgram: { ref: FormModalTrainingProgram },
    formModalTrainingProgramScheduledSlot: { ref: FormModalTrainingProgramScheduledSlot },
    formModalTrainingProgramActivation: { ref: FormModalTrainingProgramActivation },
    formModalTrainingCycleTemplate: { ref: FormModalTrainingCycleTemplate },
    modalCalendarEvent: { ref: ModalCalendarEvent },
    modalJournalEntry: { ref: ModalJournalEntry },
    modalShareTrainingCycle: { ref: ModalShareTrainingCycle },
    modalShareTrainingProgram: { ref: ModalShareTrainingProgram },
  };
  function drawerOpen(): void {
    drawerStore.open({});
  }
  function drawerClose(): void {
    drawerStore.close();
  }

  let popupCombobox: PopupSettings = {
    event: 'click',
    target: 'combobox',
    placement: 'bottom-end',
    // Close the popup when the item is clicked
    closeQuery: '.listbox-item',
  };

  let menuItems = [
    { title: 'Dashboard', url: '/dashboard' },
    {
      title: 'Training',
      children: [
        { title: 'Training Cycles', url: '/trainingCycle' },
        { title: 'Training Programs', url: '/trainingProgram' },
        { title: 'Training Program Scheduler', url: '/trainingProgramScheduler' },
        { title: 'Exercise Log', url: '/exerciseEvent' },
        { title: 'Journal', url: '/journalEntry' },
      ],
    },
    { title: 'Climbing', children: [{ title: 'Project Notes', url: '/project' }] },
    { title: 'Widgets', url: '/widget' },
    { title: 'Feedback', url: '/feedback' },
  ];
</script>

<Modal components={modalComponentRegistry} />
<Drawer width="auto" bgDrawer="bg-white">
  <div class="pt-2 mr-4">
    {#each menuItems as item}
      {#if item.children && item.children.length > 0}
        <div class="pl-5 text text-gray-900 mt-4">
          {item.title}
        </div>

        {#each item.children as child}
          <div>
            <a class="" href={child.url}>
              <button
                class="btn rounded-md pl-3 text-gray-500 text-sm font hover:variant-soft-primary w-full mx-2 justify-start"
                on:click={drawerClose}
              >
                {child.title}
              </button>
            </a>
          </div>
        {/each}
      {:else}
        <div>
          <a href={item.url}>
            <button
              class="btn rounded-md pl-3 text-gray-500 text-sm font hover:variant-soft-primary w-full mx-2 justify-start"
              on:click={drawerClose}
            >
              {item.title}
            </button>
          </a>
        </div>
      {/if}
    {/each}
  </div>
</Drawer>

<Toast />

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
            {#if item.children && item.children.length > 0}
              <!--Create the menu button-->
              <button
                class="btn hover:variant-soft-primary rounded-md text-gray-600 font-light px-3"
                use:popup={{ ...popupCombobox, target: item.title }}
              >
                <div class="flex items-center space-x-1">
                  <span class="capitalize">{item.title}</span>
                  <span class="text-gray-400">
                    <Icon icon="ion:caret-down" height="15" />
                  </span>
                </div>
              </button>
              <!--Create the pop up-->
              <div class="card w-48 min-w-min shadow-xl py-2 z-50" data-popup={item.title}>
                <nav class="list-nav">
                  <ul>
                    {#each item.children as child}
                      <li class="listbox-item px-1">
                        <a href={child.url}> {child.title} </a>
                      </li>
                    {/each}
                  </ul>
                </nav>
                <div class="arrow bg-white border" />
              </div>
            {:else}
              <a class="px-2 text-gray-600 hover:text-black font-light" href={item.url}>
                {item.title}
              </a>
            {/if}
          {/each}
        </div>

        {#if data.user != undefined}
          <div>
            <button class="p-1" use:popup={{ ...popupCombobox, target: 'auth' }}>
              <Icon icon="iconamoon:profile-circle-fill" height="28" />
            </button>
          </div>
        {:else}
          <a class="px-2 text-gray-600 hover:text-black font-light" href="/login"> Login </a>
        {/if}
      </svelte:fragment>
    </AppBar>
    {#if countOfExercisesThatNeedMigration !== undefined && countOfExercisesThatNeedMigration > 0}
      <div class="bg-green-300 w-full text-center py-2 px-8 text-opacity-30">
        A new exercise system has been implemented. Please edit your exercises to migrate.
        <br />
        <a class="link" href="/post/exerciseMigration">Click here to learn more</a>
      </div>
    {/if}
  </svelte:fragment>

  <div class="container mx-auto px-3">
    <main class="pb-10">
      <div class="pt-5 pb-4">
        <Breadcrumbs
          url={$page.url}
          crumbs={$page.data.crumbs}
          routeId={$page.route.id}
          pageData={$page.data}
          let:crumbs
        >
          <ol class="breadcrumb">
            <li class="crumb"><a class="anchor" href="/">Home</a></li>
            {#each crumbs as c}
              <li class="crumb-separator" aria-hidden>/</li>
              <li class={`${c.url ? 'crumb' : ''}`}>
                <a class={`whitespace-nowrap ${c.url ? 'anchor' : ''}`} href={c.url}>
                  {c.title}
                </a>
              </li>
            {/each}
          </ol>
        </Breadcrumbs>
      </div>
      {#if $flash}
        {@const variant =
          $flash.type == 'success' ? 'variant-ghost-success' : 'variant-ghost-error'}
        <aside class={`alert mb-4 mt-4 ${variant}`}>
          <div class="alert-message">
            <h3 class="h3">{$flash.message}</h3>
          </div>
        </aside>
      {/if}
      <div class="pb-6" />
      <slot />
    </main>
  </div>
</AppShell>

<!-- AUTH POPUP  -->
<div class="card w-48 shadow-xl py-2 z-50" data-popup="auth">
  <nav class="list-nav">
    <ul>
      <li class="listbox-item">
        <a href="/profile"> Profile </a>
      </li>
      <li class="listbox-item">
        <FormButton action="/?/signout" class="w-full mt-0">Logout</FormButton>
      </li>
    </ul>
  </nav>
  <div class="arrow bg-white border" />
</div>
