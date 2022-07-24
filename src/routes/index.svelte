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
		authSignOut().then(session.set);
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

<h1>Twitter V1</h1>
{#if $session.user && $session.user.connections && $session.user.connections.twitter}
	<p>Signed in as:</p>
	{$session.user.connections.twitter.name}
{:else}
	<p>Not signed in</p>
	<a href="/api/auth/signin/twitter?redirect=/"> Connect </a>
{/if}

<h1>Twitter V2 Provider</h1>
{#if $session.user && $session.user.connections && $session.user.connections.twitterV2}
	<p>Signed in as:</p>
	{JSON.stringify($session.user.connections)}

	{$session.user.connections.twitterV2.screenname}
{:else}
	<p>Not signed in</p>
	<a href="/api/auth/signin/twitterV2?redirect=/"> Connect </a>
{/if}

<h1>Reddit</h1>
{#if $session.user && $session.user.connections && $session.user.connections.reddit}
	<p>Signed in as:</p>
	{$session.user.connections.reddit.name}
{:else}
	<p>Not signed in</p>
	<a href="/api/auth/signin/reddit?redirect=/"> Connect </a>
{/if}

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
