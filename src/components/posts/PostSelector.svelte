<script>
  import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';
  import { updatePost } from '$lib/api';
  import RedditCard from '@/components/posts/RedditCard.svelte';
  import TwitterCard from '@/components/posts/TwitterCard.svelte';

  export let platform = '';
  export let subjectId = '';
  export let posts = [];
  const cardUI = true;

  // Sort posts by score.
  $: {
    if (platform === 'reddit') {
      posts.sort((a, b) => b.data.score - a.data.score);
    }

    if (platform === 'twitter') {
      posts.sort((a, b) => b.data.user.followers_count - a.data.user.followers_count);
    }
  }

  // Handle selection of a post.
  async function handlePostSelect(postId) {
    const i = posts.findIndex((p) => p.id === postId);
    const post = posts[i];
    post.starred = !post.starred;

    const updatedPostResponse = await updatePost(post);

    if (updatedPostResponse.ok) {
      const updatedPost = await updatedPostResponse.json();
      posts[i] = updatedPost;

      // Reactivity in Svelte is based on assignments.
      posts = [...posts];
    }
  }
</script>

{#if platform === 'reddit'}
  {#if cardUI}
    {#each posts as post}
      <RedditCard {post} onSelect={handlePostSelect} />
    {/each}
  {:else}
    <table class="table">
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col">submission</th>
          <th scope="col">score</th>
          <th scope="col">comments</th>
          <th scope="col">author</th>
          <th scope="col">created</th>
        </tr>
      </thead>
      <tbody>
        {#each posts as post}
          <tr class="post-row">
            <th><input type="checkbox" checked={post.starred} on:click={handlePostSelect} /></th>
            <th scope="row" class="submission-title"
              ><span on:click={handlePostSelect(post.id)}>{post.data.title}</span>
              <a
                class="permalink"
                href={`https://reddit.com${post.data.permalink}`}
                target={post.id}><div class="icon"><FaExternalLinkAlt /></div></a
              ></th
            >
            <td>{post.data.score}</td>
            <td>{post.data.num_comments}</td>
            <td>{post.data.author?.name}</td>
            <td>{post.created_at}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{:else if cardUI}
  {#each posts as post}
    <TwitterCard {post} onSelect={handlePostSelect} />
  {/each}
{:else}
  <table class="table">
    <thead>
      <tr>
        <th scope="col" />
        <th scope="col">tweet</th>
        <th scope="col">author</th>
        <th scope="col">followers</th>
        <th scope="col">retweets</th>
        <th scope="col">favorites</th>
        <th scope="col">created</th>
      </tr>
    </thead>
    <tbody>
      {#each posts as post}
        <tr class="post-row">
          <th
            ><input
              type="checkbox"
              checked={post.starred}
              on:click={handlePostSelect(post.id)}
            /></th
          >
          <th scope="row"
            ><span class="tweet-text" on:click={handlePostSelect(post.id)}>{post.data.text}</span>
            <a
              class="permalink"
              href={`https://www.twitter.com/${post.data.user.screen_name}/statuses/${post.data.id_str}`}
              target={post.id}><div class="icon"><FaExternalLinkAlt /></div></a
            ></th
          >
          <td>{post.data.user.screen_name}</td>
          <td>{post.data.user.followers_count}</td>
          <td>{post.data.tweet.retweet_count}</td>
          <td>{post.data.tweet.favorite_count}</td>
          <td>{post.created_at}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  .post-row {
    cursor: pointer;
  }

  .tweet-text {
    display: inline-block;
    max-width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon {
    display: inline-block;
    width: 12px;
  }
</style>
