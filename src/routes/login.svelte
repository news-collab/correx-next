<script>
	import { session } from '$app/stores';
</script>

<h1>Twitter</h1>
{#if $session.user && $session.user.connections && $session.user.connections.twitterV2}
	<p>Signed in as:</p>
	{JSON.stringify($session.user.connections)}

	{$session.user.connections.twitterV2.screenname}
{:else}
	<p>Not signed in</p>
	<a href="/api/auth/signin/twitter?redirect=/">Connect</a>
{/if}

<h1>Reddit</h1>
{#if $session.user && $session.user.connections && $session.user.connections.reddit}
	<p>Signed in as:</p>
	{$session.user.connections.reddit.name}
{:else}
	<p>Not signed in</p>
	<a href="/api/auth/signin/reddit?redirect=/">Connect</a>
{/if}
