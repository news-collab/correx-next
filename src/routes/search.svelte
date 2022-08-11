<script context="module">
	export async function load({ params, fetch, session }) {
		if (session.user && session.user.id) {
			const path = '/subjects.json';
			const response = await fetch(path, { credentials: 'include' });

			if (response.status == 200) {
				return {
					status: 200,
					props: {
						subjects: await response.json()
					}
				};
			}

			return {
				status: 500,
				props: {
					subjects: []
				}
			};
		}
	}
</script>

<script>
	import MyRecentSubjects from '@/components/subjects/MyRecent.svelte';
	import { goto } from '$app/navigation';
	import { isURL } from '$lib/validation';

	let searchForm = {
		url: '',
		valid: true,
		errors: []
	};

	let searchFormModal = {
		open: false,
		showModalBackdrop: true,
		onClosed: false
	};

	const modalClose = () => {
		searchFormModal.open = false;
	};

	export let subjects = [];
	let getData = async function (el) {
		searchForm.errors = [];
		if (!isURL(searchForm.url)) {
			searchForm.errors.push('Please enter a valid URL');
		} else {
			const response = await fetch('/subjects.json', {
				method: 'POST',
				body: JSON.stringify({ url: searchForm.url }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const subject = await response.json();
				goto(`subject/${subject.id}`);
			} else if (response.status == 500) {
				searchFormModal.open = true;
			} else {
				alert(`There was an error\n${JSON.stringify(await response.json())}`);
			}
		}
	};
</script>

<svelte:head>
	<title>Correx Search</title>
</svelte:head>

<div class="container-fluid">
	<div class="row">
		<div class="search col">
			<h1>Find a Story</h1>

			<form on:submit|preventDefault={getData}>
				<div id="search-bar">
					<input
						type="text"
						placeholder="Enter a URL to begin your search"
						bind:value={searchForm.url}
						class={`form-control`}
						class:is-invalid={searchForm.errors.length > 0}
						required
					/>
					<input type="button" value="Search" on:click|preventDefault={getData} />
				</div>
				{#if searchForm.errors.length > 0}
					{#each searchForm.errors as error}
						<div class="text-danger px-4">{error}</div>
					{/each}
				{/if}
			</form>
		</div>
	</div>
	{#if subjects.length}
		<div class="row">
			<div class="col">
				<MyRecentSubjects {subjects} />
			</div>
		</div>
	{/if}
</div>

<div
	class:open={searchFormModal.open == true}
	class="modal search-form-modal"
	id="searchFormModal"
	tabindex="-1"
	role="dialog"
	aria-labelledby="search-form-modal"
	aria-hidden={false}
	data-backdrop={searchFormModal.showModalBackdrop}
>
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="search-form-modal">No Results Found</h5>
			</div>
			<div class="modal-body">
				<p>No results were found for the URL:</p>
				<p>{searchForm.url}</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal" on:click={modalClose}
					>Close</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.search-form-modal {
		display: none;
	}

	.search-form-modal.open {
		display: block;
	}

	#search-bar {
		display: flex;
		align-items: center;
	}

	#search-bar input {
		padding: 8px;
		margin: 8px;
	}

	#search-bar .text-input {
		width: 100%;
	}

	.search {
		margin-bottom: 1em;
	}
	.button-disable {
		cursor: not-allowed;
	}
</style>
