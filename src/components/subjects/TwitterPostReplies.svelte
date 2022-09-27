<script>
  import TwitterReplies from '@/components/replies/TwitterReplies.svelte';

  export let posts = [];

  async function handleNewReply() {}
</script>

<div class="accordion open" id="post-accordian">
  {#each posts as post}
    <div class="accordion-item">
      <h2 class="accordion-header" id={`post-header-${post.id}`}>
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#post-${post.id}`}
          aria-expanded="false"
          aria-controls={`post-${post.id}`}
        >
          {post.data.text}
        </button>
      </h2>
      <div
        id={`post-${post.id}`}
        class="accordion-collapse collapse"
        aria-labelledby={`post-header-${post.id}`}
        data-bs-parent="#post-accordian"
      >
        <div class="accordion-body">
          <TwitterReplies {post} />
        </div>
      </div>
    </div>
  {/each}
</div>
