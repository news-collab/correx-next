<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import FaReddit from 'svelte-icons/fa/FaReddit.svelte';
	import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte';
</script>

<div class="login">
	<div class="twitter">
		<h1>Twitter</h1>
		{#if $session.user && $session.user.connections && $session.user.connections.twitterV2}
			<p>Signed in as:</p>
			{JSON.stringify($session.user.connections)}

			{$session.user.connections.twitterV2.screenname}
		{:else}
			<p>Signup or login with your Twitter account.</p>
			<button
				on:click={() => {
					goto('/api/auth/signin/twitter?redirect=/session/new');
				}}
			>
				<div class="icon">
					<FaTwitterSquare />
				</div>
				<span>Login</span>
			</button>
		{/if}
	</div>

	<div class="reddit">
		<h1>Reddit</h1>
		{#if $session.user && $session.user.connections && $session.user.connections.reddit}
			<p>Signed in as:</p>
			{$session.user.connections.reddit.name}
		{:else}
			<p>Signup or login with your Reddit account.</p>
			<button
				on:click={() => {
					goto('/api/auth/signin/reddit?redirect=/session/new');
				}}
			>
				<div class="icon">
					<FaReddit />
				</div>
				<span>Login</span>
			</button>
		{/if}
	</div>
</div>

<style>
	.login {
		display: flex;
		justify-content: space-evenly;
	}

	button {
		display: inline-flex;
		justify-content: center;
		padding: 5px 10px;
	}

	.icon {
		display: inline-block;
		height: 16px;
		margin-right: 0.25rem;
	}
</style>
