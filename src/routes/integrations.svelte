<script>
	import { session } from '$app/stores';
</script>

<svelte:head>
	<title>Correx - User Integrations</title>
</svelte:head>

<h1>Integrations</h1>

<p>
	As a Correx user, you can login with our supported integrations. In addition, these integrations
	are used when searching or following up with a story.
</p>

<h2>Twitter</h2>
{#if $session.user && $session.user.connections && $session.user.connections.twitterV2}
	<p>Signed in as:</p>
	{JSON.stringify($session.user.connections)}

	{$session.user.connections.twitterV2.screenname}
{:else}
	<p>Not signed in</p>
	<a href="/api/auth/signin/twitter?redirect=/session/new">Connect</a>
{/if}

<h2>Reddit</h2>
{#if $session.user && $session.user.connections && $session.user.connections.reddit}
	<p>Signed in as:</p>
	{$session.user.connections.reddit.name}
{:else}
	<p>Not signed in</p>
	<a href="/api/auth/signin/reddit?redirect=/session/new">Connect</a>
{/if}
