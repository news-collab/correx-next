<script>
  import FaReddit from 'svelte-icons/fa/FaReddit.svelte';
  import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte';
  import moment from 'moment';
  import { goto } from '$app/navigation';

  export let subjects = [];
  subjects = subjects.filter((word) => moment().diff(word.createdAt, 'days') < 8);
  async function handleSubjectClick(id) {
    await goto(`/subject/${id}`);
  }
</script>

<h2>Stories you are tracking</h2>

<table class="table recent-subjects">
  <thead>
    <tr>
      <th>Story</th>
    </tr>
  </thead>
  <tbody>
    {#each subjects as subject}
      <tr>
        <td class="subject">
          <div class="subject-header">
            <div class="title text-truncate">
              {subject.metadata && subject.metadata.title ? subject.metadata.title : subject.url}
            </div>
            <div class="platform-buttons">
              <button
                type="button"
                class="btn btn-sm reddit"
                on:click={() => {
                  goto(`/subjects/${subject.id}/reddit`);
                }}
                ><div class="icon">
                  <FaReddit />
                </div>
                Reddit</button
              >

              <button
                type="button"
                class="btn btn-sm twitter"
                on:click={() => {
                  goto(`/subjects/${subject.id}/twitter`);
                }}
                ><div class="icon">
                  <FaTwitterSquare />
                </div>
                Twitter</button
              >
            </div>
          </div>
          {#if subject.metadata && subject.metadata.title}
            <div class="text-truncate url">{subject.url}</div>
          {/if}
          <div class="subject-footer">
            <span class="submitted-at">
              {moment(subject.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            </span>
            <span class="external-link">
              <a href={subject.url} target={subject.url}>open</a>
              <a href={subject.url} target={subject.url}><i class="bi bi-box-arrow-up-right" /> </a>
            </span>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  :global(table.recent-subjects) {
    table-layout: fixed;
  }

  td.subject {
    cursor: pointer;
  }

  .subject-header {
    display: flex;
    justify-content: space-between;
  }

  .title {
    font-weight: bold;
    max-width: 80%;
  }

  .platform-buttons {
  }

  .submitted-footer {
    display: flex;
    font-size: 0.8em;
  }

  .external-link {
    display: none;
  }

  td.subject:hover .external-link {
    display: inline;
  }

  button .icon {
    display: inline-block;
    margin-right: 5px;
    height: 12px;
    width: 12px;
  }
  .title button {
    display: inline-flex;
  }
  button.reddit {
    color: #fff;
    background-color: #ff4500;
  }
  button.twitter {
    color: #fff;
    background-color: rgb(29 155 237);
  }
</style>
