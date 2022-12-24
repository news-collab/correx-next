<script>
  import { inviteUser, lookupTwitterUsers, updateUser } from '../../../lib/api';

  let user = {
    role: 'user'
  };

  export let data;
  let users = data.users;
  let pristine = true;

  async function inviteTwitterUser(twitterUser) {
    const response = await inviteUser({
      twitterId: twitterUser.id_str,
      name: twitterUser.name,
      screenname: twitterUser.screen_name,
      description: twitterUser.description,
      verified: twitterUser.verified,
      twitterCreatedAt: twitterUser.created_at,
      avatarUrl: twitterUser.profile_background_image_url_https,
      role: user.role
    });

    if (!response.ok) {
      let respJson = await response.json();
      alert(`${respJson.message}`);
    } else {
      alert('user invited!');
    }
  }

  async function searchUsers() {
    try {
      const response = await lookupTwitterUsers(user.screenname);
      if (response.ok) {
        const data = await response.json();
        users = data.users;
      }
    } catch (e) {
      alert(`${await response.json().message}`);
    }

    pristine = false;
  }

  async function updateUserRole(e, id) {
    let user = {
      id,
      admin: e.target.value === 'admin'
    };
    const response = await updateUser(user);
  }

  async function updateUserApproval(e, id) {
    let user = {
      id,
      approved: e.target.checked
    };
    const response = await updateUser(user);
    if (response.status == 200) {
      let body = await response.json();
      //updateUsers(body.user);
    }
  }
</script>

<!--<div class="invite-user">
  <div class="invite-user-header">
    <h1>Invite a User</h1>
  </div>
  <div class="search-for-user">
    <h2>Search for Twitter User</h2>
    <form on:submit|preventDefault={searchUsers}>
      <div class="row">
        <label for="screenname">Twitter username</label>
        <input
          type="text"
          name="screenname"
          id="screenname"
          required
          bind:value={user.screenname}
        />
        <input type="submit" name="submit" value="Search for Twitter User" />
      </div>
      <div class="twitter-users">
        <div>
          {#if users.length === 0 && !pristine}
            <div>No Twitter users found</div>
          {:else}
            {#each users as u}
              <div class="twitter-user">
                <div>{u.screen_name}</div>
                <select name="role" id="role" bind:value={user.role}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button value="Invite" type="button" on:click={inviteTwitterUser(u)}>Invite</button>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </form>
  </div>
  <div class="search-for-user">
    <h2>Invite user by email</h2>
    <form on:submit|preventDefault={searchUsers}>
      <div class="row">
        <label for="email">Email</label>
        <input type="text" name="email" id="email" required bind:value={user.email} />
        <input type="submit" name="submit" value="Invite" />
      </div>
      <div class="twitter-users">
        <div>
          {#if users.length === 0 && !pristine}
            <div>No Twitter users found</div>
          {:else}
            {#each users as u}
              <div class="twitter-user">
                <div>{u.screen_name}</div>
                <select name="role" id="role" bind:value={user.role}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button value="Invite" type="button" on:click={inviteTwitterUser(u)}>Invite</button>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </form>
  </div>
</div>-->

<div class="users">
  {#if users.length > 0}
    <table>
      <tr>
        <th>Name</th>
        <th>Role</th>
        <th>Approved</th>
      </tr>
      {#each users as user}
        <tr>
          <td>{user.email}</td>
          <td>
            {#if user.id === data.user.id}
              [n/a]
            {:else}
              <select name="role" on:change={(e) => updateUserRole(e, user.id)}>
                <option value="user" selected={user.admin === false}>User</option>
                <option value="admin" selected={user.admin === true}>Admin</option>
              </select>
            {/if}
          </td>
          <td>
            {#if user.id === data.user.id}
              [n/a]
            {:else}
              <input
                type="checkbox"
                name="approved"
                bind:checked={user.approved}
                on:change={(e) => updateUserApproval(e, user.id)}
              />
            {/if}
          </td>
        </tr>
      {/each}
    </table>
  {:else}
    <p>No users</p>
  {/if}
</div>

<style>
  form .row {
    display: block;
  }

  .twitter-users {
    margin: 10px 0px;
  }

  .twitter-user {
    display: flex;
  }
</style>
