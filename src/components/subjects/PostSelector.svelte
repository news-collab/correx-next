<script>
  import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';
  import { updatePost } from '$lib/api';

  export let subjectId = '';
  export let posts = [];
  // Sort posts by score.
  $: posts.sort((a, b) => b.data.score - a.data.score);

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

<table class="table">
  <thead>
    <tr>
      <th scope="col" />
      <th scope="col">submission title</th>
      <th scope="col">score</th>
      <th scope="col">comments</th>
      <th scope="col">author</th>
      <th scope="col">created</th>
    </tr>
  </thead>
  <tbody>
    {#each posts as post}
      <tr class="post-row">
        <th
          ><input type="checkbox" checked={post.starred} on:click={handlePostSelect(post.id)} /></th
        >
        <th scope="row" class="submission-title"
          ><span on:click={handlePostSelect(post.id)}>{post.data.title}</span>
          <a class="permalink" href={`https://reddit.com${post.data.permalink}`} target={post.id}
            ><div class="icon"><FaExternalLinkAlt /></div></a
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

<style>
  .post-row {
    cursor: pointer;
  }

  .submission-title {
  }
  .icon {
    display: inline-block;
    width: 12px;
  }
</style>
