<script context="module">
  export async function preload({ params, query }) {
    const path = `/subjects.json`;
    const res = await this.fetch(path);
    const data = await res.json();

    if (res.status === 200) {
      return { subjects: data.subjects };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import SubjectsList from "@/components/admin/subjects/List.svelte";

  export let subjects;
</script>

<h1>Subjects</h1>
<SubjectsList {subjects} />
