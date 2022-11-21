<script>
  import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';
  import IoIosChatbubbles from 'svelte-icons/io/IoIosChatbubbles.svelte';
  import MdCheckBoxOutlineBlank from 'svelte-icons/md/MdCheckBoxOutlineBlank.svelte';
  import MdCheckBox from 'svelte-icons/md/MdCheckBox.svelte';
  import GoArrowUp from 'svelte-icons/go/GoArrowUp.svelte';
  import GoArrowDown from 'svelte-icons/go/GoArrowDown.svelte';
  import moment from 'moment';

  export let post;
  export let onSelect;
</script>

<div class="card" style="width: 18rem;">
  <div class="card-body">
    <div class="card-title">
      <div class="author">
        <a href="https://www.reddit.com/u/{post.data.author.name}" target="author_{post.id}"
          >{post.data.author.name}</a
        >
        <a href={`https://reddit.com/${post.data.permalink}`} target="reddit_${post.platform_id}"
          >wrote</a
        >
        on
        <div class="created">
          {moment.parseZone(post.data.created_at).format('MMMM Do YYYY, h:mm:ss a')}
        </div>
      </div>
    </div>
    <div class="card-text">
      {post.data.title}
    </div>
    <div class="watching">
      <button
        class="btn watching-button"
        class:btn-secondary={post.replies.length === 0}
        class:btn-info={post.replies.length > 0}
        data-bs-toggle="modal"
        data-bs-target="#reply_modal"
        on:click={onSelect(post.id)}
      >
        {#if post.replies.length > 0}
          {post.replies.length} replies
        {:else}
          Followup
        {/if}
      </button>
    </div>
    <div class="card-footer">
      <div class="footer">
        <div class="up-vote">
          <div class="up-vote-icon">
            <div class="icon">
              <GoArrowUp />
            </div>
            {post.data.ups}
          </div>
        </div>
        <div class="down-vote">
          <div class="down-vote-icon">
            <div class="icon">
              <GoArrowDown />
            </div>
            {post.data.downs}
          </div>
        </div>
        <div class="comments">
          <div class="comment-icon">
            <div class="icon">
              <IoIosChatbubbles />
            </div>
            {post.data.num_comments}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    display: inline-flex;
    margin: 10px;
  }

  .card-title {
    font-weight: bold;
  }

  .external-submission-link.icon {
    display: inline-block;
    width: 12px;
    height: 12px;
  }

  .up-vote-icon .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .down-vote-icon .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .comment-icon .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .watching {
    color: #000;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .watching-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .watching .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .watching .icon.starred {
    color: #000;
  }

  .card-text {
    margin-bottom: 20px;
  }

  .created {
    font-size: 0.8em;
  }

  .card-footer {
    background-color: inherit;
    margin-bottom: 0px;
  }

  .footer {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
  }
</style>
