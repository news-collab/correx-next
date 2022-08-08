<script>
	import { onMount } from 'svelte';
	import { session, page } from '$app/stores';
	import { goto } from '$app/navigation';

	const tokens = {
		twitter: $session?.user?.connections?.twitter?.tokens,
		reddit: $session?.user?.connections?.reddit?.tokens
	};

	const newSessionRequest = {
		userId: $session?.user?.id,
		tokens
	};

	async function requestCookie() {
		// Default options are marked with *
		const response = await fetch(`${import.meta.env.VITE_BASE_URL}/session/new.json`, {
			method: 'POST',
			mode: 'same-origin',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newSessionRequest) // body data type must match "Content-Type" header
		});
		return response.json(); // parses JSON response into native JavaScript objects
	}

	async function onload() {
		await requestCookie();
		goto('/');
	}

	onMount(() => {
		onload();
	});
</script>

{JSON.stringify($session.user)}
