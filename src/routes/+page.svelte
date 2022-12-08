<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { signOut as authSignOut } from 'sk-auth/client';
  import Twitter from 'twitter-v2';

  function createNewVisitorCookie() {
    document.cookie = 'new_visitor=true;';
  }

  function getNewVisitorCookie() {
    return document.cookie.split('; ').find((row) => row.startsWith('new_visitor='));
  }

  function signOut() {
    authSignOut();
  }

  onMount(async () => {
    if (!document.cookie) {
      createNewVisitorCookie();
      await goto('/about');
      return;
    }

    const newVisitorCookie = getNewVisitorCookie();

    if (!newVisitorCookie) {
      createNewVisitorCookie();
    }
  });
</script>

<svelte:head>
  <title>Correx</title>
</svelte:head>

<div class="docs-container">
  <h1>Introducing Correx</h1>

  <p>
    Thanks for trying Correx.news, the ASU News Co/Lab's new corrections tool. Our goal is to help
    you easily send corrections and major updates down the same social media pathways that the
    original stories traveled.
  </p>
</div>

<style>
  h1 {
    text-align: center;
    margin: 0 auto;
    font-size: 2.8em;
    font-weight: bold;
    margin: 0 0 0.5em 0;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
