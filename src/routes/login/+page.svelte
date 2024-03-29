<script>
  import { redirect } from '@sveltejs/kit';
  import { required, length, confirmation } from '$lib/validation/validators';
  import { login } from '$lib/api';
  import { goto, invalidateAll } from '$app/navigation';

  let loginSubmitted = false;
  let email = '';
  let emailError = '';
  let password = '';
  let passwordError = '';
  let validLogin = false;
  let loginErrorMessage = '';

  $: {
    if (loginSubmitted) {
      emailError = required(email, 'Email is required');
      passwordError = length(password, 5, 'Password must be at least 5 characters');

      validLogin = emailError.length === 0 && passwordError.length === 0;
    }
  }

  function handleSubmit() {
    loginSubmitted = true;
  }

  async function handleLogin() {
    if (validLogin) {
      try {
        const loginData = JSON.stringify({
          email,
          password
        });

        const response = await login(loginData);
        if (response.redirected) {
          loginErrorMessage = '';
          console.log('url', response.url);
          await invalidateAll();
          window.location = response.url;
          return;
        }

        if (response.ok) {
          loginErrorMessage = '';
          const location = response.headers.get('Location');
          await invalidateAll();
          goto(location);
        } else {
          loginErrorMessage = 'Invalid email and/or password.';
        }
      } catch (e) {
        loginErrorMessage = 'Could not login, please try again later.';
        console.error(`Error logging in: ${e}`, e);
      }
    }
  }
</script>

<h1>Login</h1>

{#if loginErrorMessage}
  <div class="alert alert-danger" role="alert">
    {loginErrorMessage}
  </div>
{/if}

<form on:submit|preventDefault={handleLogin}>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input
      type="email"
      class="form-control is-invalid"
      class:is-invalid={emailError}
      id="email"
      placeholder="phil.theist@gmail.com"
      bind:value={email}
    />
    <div id="validationEmail" class:invalid-feedback={emailError}>
      {emailError}
    </div>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input
      type="password"
      class="form-control"
      class:is-invalid={passwordError}
      id="password"
      bind:value={password}
    />
    <div id="validationPassword" class:invalid-feedback={passwordError}>
      {passwordError}
    </div>
  </div>
  <div class="mb-3">
    <button class="btn btn-primary" on:click={handleSubmit}>Login</button>
  </div>
</form>
