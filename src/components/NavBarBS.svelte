<script>
	import { session } from '$app/stores';
	let logoutModal = {
		open: false,
		showModalBackdrop: true,
		onClosed: false
	};
</script>

<div
	class:open={logoutModal.open == true}
	class="modal logout-modal"
	id="logoutModal"
	tabindex="-1"
	role="dialog"
	aria-labelledby="logout-modal"
	aria-hidden={false}
	data-backdrop={logoutModal.showModalBackdrop}
>
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="logout-modal">Logout</h5>
			</div>
			<div class="modal-body">
				<p>Are you sure you would like to logout?</p>
			</div>
			<div class="modal-footer">
				<a href="/auth/logout" class="btn btn-danger" role="button" aria-pressed="true">Logout</a>
				<button
					type="button"
					class="btn btn-secondary"
					data-dismiss="modal"
					on:click={() => (logoutModal.open = false)}>Close</button
				>
			</div>
		</div>
	</div>
</div>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Correx</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<a class="nav-link" href="/search" sapper:prefetch>Search</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/about" sapper:prefetch>About</a>
				</li>
				<li class="nav-item dropdown" />
			</ul>
			{#if $session.passport && $session.passport.user}
				<div class="d-flex">
					<ul class="navbar-nav">
						<li class="nav-item dropdown">
							<a
								class="nav-link dropdown-toggle"
								href="#"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<img class="avatar" src={$session.passport.user.avatarUrl} alt="Avatar" />
							</a>

							<ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="navbarDropdown">
								<li>
									<a
										class="dropdown-item"
										href="https://www.twitter.com/{$session.passport.user.screenname}"
										>@{$session.passport.user.screenname}</a
									>
								</li>
								{#if $session.passport.user.admin}
									<li>
										<a class="dropdown-item" href="/admin/users" sapper:prefetch>User Management</a>
									</li>
									<li>
										<a class="dropdown-item" href="/admin/subjects" sapper:prefetch
											>Subject Management</a
										>
									</li>
								{/if}
								<li><hr class="dropdown-divider" /></li>
								<li>
									<div
										class="dropdown-item"
										on:click={() => {
											logoutModal.open = true;
										}}
									>
										Logout
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			{:else}
				<ul class="navbar-nav">
					<li class="nav-item">
						<a class="nav-link" href="/api/auth/signin/twitter?redirect=/" sapper:prefetch>Login</a>
					</li>
				</ul>
			{/if}
		</div>
	</div>
</nav>

<style>
	.avatar {
		border-radius: 50%;
		max-height: 32px;
	}
	.logout-modal {
		display: none;
	}

	.logout-modal.open {
		display: block;
	}
</style>
