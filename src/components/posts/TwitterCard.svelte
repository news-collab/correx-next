<script>
  import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';
  import MdCheckBoxOutlineBlank from 'svelte-icons/md/MdCheckBoxOutlineBlank.svelte';
  import MdCheckBox from 'svelte-icons/md/MdCheckBox.svelte';
  import FaRetweet from 'svelte-icons/fa/FaRetweet.svelte';
  import FaUsers from 'svelte-icons/fa/FaUsers.svelte';
  import MdFavorite from 'svelte-icons/md/MdFavorite.svelte';
  import moment from 'moment';

  export let post;
  export let onSelect;
</script>

<div class="card" style="width: 18rem;">
  <div class="card-body">
    <div class="card-title">
      <div class="author">
        <a href="https://www.twitter.com/{post.data.user.screen_name}" target="author_{post.id}"
          >{post.data.user.screen_name}</a
        >
        Tweeted on
        <div class="created">
          {moment.parseZone(post.data.created_at).format('MMMM Do YYYY, h:mm:ss a')}
        </div>
      </div>
    </div>
    <div class="card-text">
      {post.data.text}
    </div>
    <div class="watching">
      <button
        class="btn watching-button"
        class:btn-secondary={!post.starred}
        class:btn-info={post.starred}
        on:click={onSelect(post.id)}
      >
        {#if post.starred}
          <div class="icon starred">
            <MdCheckBox />
          </div>
          <div>Followup</div>
        {:else}
          <div class="icon">
            <MdCheckBoxOutlineBlank />
          </div>
          <div>Followup</div>
        {/if}
      </button>
    </div>
    <div class="card-footer">
      <div class="footer">
        <div class="followers">
          <div class="follower-icon">
            <div class="icon">
              <FaUsers />
            </div>
            {post.data.user.followers_count.toLocaleString()}
          </div>
        </div>
        <div class="retweet">
          <div class="retweet-icon">
            <div class="icon">
              <FaRetweet />
            </div>
            {post.data.tweet.retweet_count}
          </div>
        </div>
        <div class="favorite">
          <div class="favorite-icon">
            <div class="icon">
              <MdFavorite />
            </div>
            {post.data.tweet.favorite_count}
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

  .retweet-icon .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .favorite-icon .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .follower-icon .icon {
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
