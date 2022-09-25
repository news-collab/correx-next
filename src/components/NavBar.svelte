<script>
  import { page } from '$app/stores';
  import { signOut as authSignOut } from 'sk-auth/client';
  import { goto } from '$app/navigation';

  let logoutModal = {
    open: false,
    showModalBackdrop: true,
    onClosed: false
  };

  let { user } = $page.data;

  function logout() {
    document.cookie = 'session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';

    logoutModal.open = false;
    goto('/login');
  }
</script>

<div
  class:open={logoutModal.open === true}
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
        <button class="btn btn-danger" on:click={logout}>Logout</button>
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
          <a class="nav-link" href="/search" data-sveltekit-prefetch>Search</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/about" data-sveltekit-prefetch>About</a>
        </li>
        <li class="nav-item dropdown" />
      </ul>
      {#if user}
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
                {#if user.avatar_url}
                  <img class="avatar" src={user.avatar_url} alt="Avatar" />
                {:else}
                  {user.email}
                {/if}
              </a>

              <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item" href="/integrations">Integrations</a>
                </li>
                {#if true}
                  <li>
                    <a class="dropdown-item" href="/admin/users" data-sveltekit-prefetch
                      >User Management</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" href="/admin/subjects" data-sveltekit-prefetch
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
            <a class="nav-link" href="/login" data-sveltekit-prefetch>Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/signup" data-sveltekit-prefetch>Signup</a>
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
