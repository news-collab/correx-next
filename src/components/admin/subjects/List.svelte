<script>
  import moment from "moment";
  import { refreshSubjectMetadata, refreshTweets } from "@/admin_api";

  export let subjects = [];

  async function handleRefreshSubjectMetadata(uuid) {
    let response = await refreshSubjectMetadata(uuid);
    if (response.status >= 200 && response.status < 300) {
      const { subject } = await response.json();
      const i = subjects.findIndex((s) => s.uuid === subject.uuid);
      console.log(`length: ${subjects.length} index: ${i}`);
      subjects = [
        ...subjects.slice(0, i),
        subject,
        ...subjects.slice(i + 1, subjects.length),
      ];
    }
  }

  async function handleRefreshTweets(uuid) {
    let response = await refreshTweets(uuid);
    if (response.status >= 200 && response.status < 300) {
      const { subject } = await response.json();
      const i = subjects.findIndex((s) => s.uuid === subject.uuid);
      console.log(`length: ${subjects.length} index: ${i}`);
      subjects = [
        ...subjects.slice(0, i),
        subject,
        ...subjects.slice(i + 1, subjects.length),
      ];
    }
  }
</script>

<table class="table table-hover subjects">
  <thead>
    <tr>
      <th>Story</th>
      <th>Submitted At</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each subjects as subject}
      <tr>
        <td>
          <div class="text-truncate">
            <a sapper:prefetch href="subject/{subject.uuid}"
              >{subject.metadata && subject.metadata.title
                ? subject.metadata.title
                : subject.url}</a
            >
          </div>
        </td>
        <td>{moment(subject.createdAt).toISOString()}</td>
        <td
          ><button
            on:click={handleRefreshSubjectMetadata(subject.uuid)}
            type="button"
            class="btn btn-primary btn-sm">Refresh Metadata</button
          ><button
          on:click={handleRefreshTweets(subject.uuid)}
          type="button"
          class="btn btn-primary btn-sm">Refresh Metadata</button
        ></td
        >
      </tr>
    {/each}
  </tbody>
</table>

<style>
  :global(table.subjects) {
    table-layout: fixed;
  }
</style>
