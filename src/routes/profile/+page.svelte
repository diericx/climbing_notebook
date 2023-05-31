<script lang="ts">
	import type { PageData } from './$types';
	import { json2csv } from 'json-2-csv';

	export let data: PageData;
	const { profile, user, metrics, exerciseEvents, journalEntries, trainingPrograms } = data;

	function downloadAsJson(resources, name) {
		var a = window.document.createElement('a');
		a.href = window.URL.createObjectURL(
			new Blob([JSON.stringify(resources)], { type: 'text/json' })
		);
		a.download = name + '.json';

		// Append anchor to body.
		document.body.appendChild(a);
		a.click();

		// Remove anchor from body
		document.body.removeChild(a);
	}

	async function downloadAsCsv(resources, name) {
		const csv = await json2csv(resources);
		var a = window.document.createElement('a');
		a.href = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
		a.download = name + '.csv';

		// Append anchor to body.
		document.body.appendChild(a);
		a.click();

		// Remove anchor from body
		document.body.removeChild(a);
	}
</script>

<h1>Account Info</h1>
<hr />
<p>Username: {user?.username}</p>
<p>Email: {user?.email}</p>

<br />

<h1 class="inline">Profile</h1>
<a href={`/profile/edit?redirectTo=/profile`}>Edit</a>
<hr />

<h2>Goals</h2>

<div class="whitespace-pre bg-white w-full px-1 py-3 rounded">
	{profile?.goals}
</div>

<br />

<br />

<div class="mb-2">
	<button
		class="btn variant-filled"
		on:click={() => downloadAsJson(exerciseEvents, 'exerciseEvents')}
		>Download Exercise Event Data as JSON</button
	>
	<button
		class="btn variant-filled"
		on:click={() => downloadAsCsv(exerciseEvents, 'exerciseEvents')}
		>Download Exercise Event Data as CSV</button
	>
</div>

<div class="mb-2">
	<button
		class="btn variant-filled"
		on:click={() => downloadAsJson(journalEntries, 'journalEntries')}
		>Download Journal Data as JSON</button
	>
	<button
		class="btn variant-filled"
		on:click={() => downloadAsCsv(journalEntries, 'journalEntries')}
		>Download Journal Data as CSV</button
	>
</div>

<div class="mb-2">
	<button class="btn variant-filled" on:click={() => downloadAsJson(metrics, 'metrics')}
		>Download Metrics Data as JSON</button
	>
	<button class="btn variant-filled" on:click={() => downloadAsCsv(metrics, 'metrics')}
		>Download Metrics Data as CSV</button
	>
</div>

<div>
	<button
		class="btn variant-filled"
		on:click={() => downloadAsJson(trainingPrograms, 'trainingPrograms')}
		>Download Training Programs as JSON</button
	>
</div>
