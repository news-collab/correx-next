<script context="module">
	import { guardAdminRoute } from '../../lib/auth/guards';

	export async function load({ params, query, session, fetch }) {
		await guardAdminRoute(session.user);

		const path = `api/users.json`;
		const res = await fetch(`${import.meta.env.VITE_BASE_URL}/${path}`);
		const users = await res.json();

		if (res.status === 200) {
			return {
				status: 200,
				props: {
					users
				}
			};
		}

		return {
			status: 500
		};
	}
</script>

<script>
	import { updateUser } from '../../api';
	import { session } from '$app/stores';

	export let users = [];

	function updateUsers(user) {
		let index = users.findIndex((u) => u.id === user.id);
		users.splice(index, 1, user);
		users = [...users];
	}

	async function updateUserRole(e, id) {
		let user = {
			id,
			admin: e.target.value === 'admin'
		};

		const response = await updateUser(user);
		if (response.status == 200) {
			let body = await response.json();
			updateUsers(body.user);
		}
	}
</script>

<h1>User Management</h1>
<nav>
	<ul>
		<li><a href="/admin/users/invite">Invite User</a></li>
	</ul>
</nav>
<section>
	<div class="users">
		{#if users.length > 0}
			<table>
				<tr>
					<th>Name</th>
					<th>Role</th>
				</tr>
				{#each users as user}
					<tr>
						<td>{user.name}</td>
						<td>
							{#if $session.user.id === user.id}
								{user.admin === true ? 'Admin' : 'User'}
							{:else}
								<select name="role" on:change={(e) => updateUserRole(e, user.id)}>
									<option value="user" selected={user.admin === false}>User</option>
									<option value="admin" selected={user.admin === true}>Admin</option>
								</select>
							{/if}
						</td>
					</tr>
				{/each}
			</table>
		{:else}
			<p>No users</p>
		{/if}
	</div>
</section>

<style>
	table th {
		text-align: left;
	}
</style>
