<script>
	export let segment;

	import { stores } from "@sapper/app";
	import DropDownMenu from "./DropDownUserMenu.svelte";

	const { session } = stores();
</script>

<nav>
	<ul>
		<li><a class:selected={segment === undefined} href=".">Home</a></li>
		<li><a class:selected={segment === "about"} href="about">About</a></li>
		<li><a class:selected={segment === "search"} href="search">Search</a></li>
		<!--
		<li><a class:selected='{segment === "about"}' href='about'>about</a></li>

		 <-/- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -/->
		<li><a rel=prefetch class:selected='{segment === "blog"}' href='blog'>blog</a></li>
		-->
		{#if $session.passport && $session.passport.user}
			<div class="loginSection">
				{#if $session.passport.user.admin}
					<li><a href="/admin/users">User Management</a></li>
				{/if}
				<li>
					<a href="/auth/logout">Logout</a>
					<!--				<i>{$session.passport.user.screenname}</i>-->
				</li>
				<li>
					<p>({$session.passport.user.screenname})</p>
				</li>
				<li>
					<DropDownMenu user={$session.passport.user} />
				</li>
				<!--<li>
					<img
						class="avatar"
						src={$session.passport.user.avatarUrl}
						alt="Avatar"
					/>
				</li>-->
			</div>
		{:else}
			<li>
				<a class:selected={segment === "login"} href="/auth/twitter"
					>Sign in with Twitter</a
				>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		border-bottom: 1px solid rgba(255, 62, 0, 0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: "";
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: "";
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255, 62, 0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

	.avatar {
		border-radius: 50%;
	}

	.loginSection {
		float: right;
		vertical-align: top;
		/*display: inline-block;*/
	}
</style>
