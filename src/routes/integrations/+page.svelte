<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import FaReddit from 'svelte-icons/fa/FaReddit.svelte';
	import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte';

	async function getTwitterAuthLink() {
		const linkResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/twitter/link`);
		const { link } = await linkResponse.json();

		window.location = link;
	}
</script>

<div class="login">
	<div class="twitter">
		<h1>Twitter</h1>
		{#if $page?.data?.session?.twitterTokens}
			<p>Signed in as "{$page.data.user.name}".</p>
		{:else}
			<p>Signup or login with your Twitter account.</p>
			<button on:click={getTwitterAuthLink}>
				<div class="icon">
					<FaTwitterSquare />
				</div>
				<span>Login</span>
			</button>
		{/if}
	</div>

	<div class="reddit">
		<h1>Reddit</h1>

		{#if $page?.data?.session?.redditTokens}
			<p>Signed in as "{$page.data.user.name}".</p>
		{:else}
			<p>Signup or login with your Reddit account.</p>
			<button
				on:click={() => {
					goto('/api/auth/reddit/authorize?redirect=/');
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
