<script>
  import { selectedPosts, sortedSelectedPosts } from '@/stores/posts.js';
  console.log(sortedSelectedPosts);
</script>

<div class="modal" id="compare_modal" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Compare Posts</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      </div>
      <div class="modal-body">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Score</th>
              <th scope="col">Convo</th>
            </tr>
          </thead>
          <tbody>
            {#each $sortedSelectedPosts as post}
              <tr>
                <th scope="row"><span class="text-truncate">{post.data.title}</span></th>
                <td>@{post.data.author.name}</td>
                <td>{post.data.score}</td>
                <td>{post.data.num_comments}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
