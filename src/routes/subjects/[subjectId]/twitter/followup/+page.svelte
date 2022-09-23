<script>
  import BreadCrumbs from '@/components/Source/Breadcrumbs.svelte';
  import TwitterPostReplies from '@/components/subjects/TwitterPostReplies.svelte';
  export let data;
  export let subjectId;
  export let subject = data.subject;
  export let posts = data.posts;

  //console.debug('followup data:', data);
</script>

<h1>
  {(subject && subject.metadata && subject.metadata.title) || subject.url}
</h1>

<BreadCrumbs subjectId={subject.id} active={'followup'} platform="twitter" />

<div class="posts">
  <TwitterPostReplies {posts} />
</div>

<style>
  .posts {
    margin-top: 10px;
  }
</style>
