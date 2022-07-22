<script>
  import { inviteUser, lookupTwitterUsers } from "../../../api";

  let user = {
    role: "user",
  };

  let users = [];
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
      role: user.role,
    });

    if (!response.ok) {
      let respJson = await response.json();
      alert(`${respJson.message}`);
    } else {
      alert("user invited!");
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
</script>

<div class="invite-user">
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
                <button
                  value="Invite"
                  type="button"
                  on:click={inviteTwitterUser(u)}>Invite</button
                >
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
        <input
          type="text"
          name="email"
          id="email"
          required
          bind:value={user.email}
        />
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
                <button
                  value="Invite"
                  type="button"
                  on:click={inviteTwitterUser(u)}>Invite</button
                >
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </form>
  </div>
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
