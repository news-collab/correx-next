<script>
  import { required, length, confirmation } from '$lib/validation/validators';
  import { signup } from '$lib/api';
  import { goto } from '$app/navigation';

  let signupSubmitted = false;
  let email = '';
  let emailError = '';
  let password = '';
  let passwordError = '';
  let confirmPassword = '';
  let confirmPasswordError = '';
  let validSignup = false;

  $: {
    if (signupSubmitted) {
      emailError = required(email, 'Email is required');
      passwordError = length(password, 5, 'Password must be at least 5 characters');
      confirmPasswordError = confirmation(password, confirmPassword, 'Passwords must match');

      validSignup =
        emailError.length === 0 && passwordError.length === 0 && confirmPasswordError.length === 0;
    }
  }

  function handleSubmit() {
    signupSubmitted = true;
  }

  async function handleSignup() {
    if (validSignup) {
      const signupData = JSON.stringify({
        email,
        password
      });

      const response = await signup(signupData);

      if (response.ok) {
        goto('/');
      }
    }
  }
</script>

<h1>Signup</h1>

<form on:submit|preventDefault={handleSignup}>
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
    <label for="confirm_password" class="form-label">Confirm Password</label>
    <input
      type="password"
      class="form-control"
      class:is-invalid={confirmPasswordError}
      id="confirm_password"
      bind:value={confirmPassword}
    />
    <div id="validationConfirmPassword" class:invalid-feedback={confirmPasswordError}>
      {confirmPasswordError}
    </div>
  </div>
  <div class="mb-3">
    <button class="btn btn-primary" on:click={handleSubmit}>Signup</button>
  </div>
</form>
