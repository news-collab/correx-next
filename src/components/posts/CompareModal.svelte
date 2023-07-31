<script>
  import { selectedPosts } from '@/stores/posts.js';
</script>

<div class="modal" id="compare_modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Compare Posts</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
        {#each $selectedPosts as post}
          <p>{post.id}</p>
        {/each}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
