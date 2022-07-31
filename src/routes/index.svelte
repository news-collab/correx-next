<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { signOut as authSignOut } from 'sk-auth/client';

	function createNewVisitorCookie() {
		document.cookie = 'new_visitor=true;';
	}

	function getNewVisitorCookie() {
		return document.cookie.split('; ').find((row) => row.startsWith('new_visitor='));
	}

	function signOut() {
		authSignOut().then(() => {
			console.log(`args`, arguments);
		});
	}

	onMount(async () => {
		if (!document.cookie) {
			createNewVisitorCookie();
			await goto('/about');
			return;
		}

		const newVisitorCookie = getNewVisitorCookie();

		if (!newVisitorCookie) {
			createNewVisitorCookie();
		}
	});
</script>

<svelte:head>
	<title>Correx</title>
</svelte:head>

<h1>Correx</h1>
<button on:click={signOut}>sign out</button>

<style>
	h1 {
		text-align: center;
		margin: 0 auto;
		font-size: 2.8em;
		font-weight: bold;
		margin: 0 0 0.5em 0;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
