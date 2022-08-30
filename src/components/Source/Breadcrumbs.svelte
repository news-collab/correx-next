<script>
	import { goto } from '$app/navigation';

	export let platform;
	export let active;
	export let subjectId;

	function isActive(segment) {
		return active == segment;
	}

	function navigate(target) {
		const path = `/subjects/${subjectId}/${platform}/${target}`;
		console.debug(`navigating to ${path}`);
		if (target != active) {
			goto(path);
		}
	}
</script>

<nav>
	<div on:click={() => navigate('results')} class="segment" class:active={isActive('results')}>
		Results
	</div>
	<div>&gt;</div>
	<div on:click={() => navigate('followup')} class="segment" class:active={isActive('followup')}>
		Followup
	</div>
</nav>

<style>
	nav {
		display: flex;
	}
	.segment {
		text-decoration: underline;
	}
	.active {
		background: lightpink;
		text-decoration: double;
		cursor: default;
	}
	nav > div {
		padding: 16px;
		cursor: pointer;
	}
</style>
