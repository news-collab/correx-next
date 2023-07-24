<script>
  import FaReddit from 'svelte-icons/fa/FaReddit.svelte';
  import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte';
  import { goto } from '$app/navigation';

  export let platform;
  export let active;
  export let subjectId;

  function isActive(segment) {
    return active == segment;
  }

  function navigate() {
    let path;

    switch (active) {
      case 'results':
        path = `/subjects/${subjectId}/${platform}`;
        break;

      case 'followup':
        path = `/subjects/${subjectId}/${platform}/${active}`;
        break;
    }

    console.debug(`navigating to ${path}`);
    goto(path);
  }
</script>

<nav>
  <div class="segment">
    <div class="btn-group" role="group" aria-label="Platforms">
      <button
        type="button"
        class="btn"
        class:reddit={platform === 'reddit'}
        class:btn-secondary={platform !== 'reddit'}
        on:click={() => {
          platform = 'reddit';
          navigate();
        }}
        ><div class="icon">
          <FaReddit />
        </div>
        Reddit</button
      >
      <button
        type="button"
        class="btn"
        class:twitter={platform === 'twitter'}
        class:btn-secondary={platform !== 'twitter'}
        on:click={() => {
          platform = 'twitter';
          navigate();
        }}
        ><div class="icon">
          <FaTwitterSquare />
        </div>
        Twitter</button
      >
    </div>

    <button type="button" class="btn btn-primary">Compare</button>
  </div>
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
  }
  .segment {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .active {
    text-decoration: double;
    cursor: default;
    background-color: lightpink;
  }
  nav > div {
    padding: 16px;
    cursor: pointer;
  }
  button {
    display: flex;
    align-items: center;
  }
  button.reddit {
    color: #fff;
    background-color: #ff4500;
  }
  button.reddit:hover {
    color: #fff;
    background-color: #ff4500;
  }
  button.twitter {
    color: #fff;
    background-color: rgb(29 155 237);
  }
  button.twitter:hover {
    color: #fff;
    background-color: rgb(29 155 237);
  }
  button .icon {
    margin-right: 5px;
    height: 24px;
    width: 24px;
  }
</style>
