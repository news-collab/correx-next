<script>
  import { browser } from '$app/environment';

  import { invalidateAll } from '$app/navigation';

  export let data;

  async function welcome() {
    await invalidateAll();
  }
  if (browser) {
    welcome();
  }

  console.log(data);
</script>

<h1>Welcome</h1>

<p>
  Thank you for your interest in Correx. We're currently in a closed beta but will reach out as soon
  as signups are open.
</p>
