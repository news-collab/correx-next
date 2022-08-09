export async function getUserSubjects(user) {
  return await fetch(`subjects.json`, {
    credentials: "include",
  });
}

export async function getConversation(id) {
  return await fetch(`conversation.json`, {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateUser(user) {
  return fetch(`users/${user.id}.json`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    },
  });
}

export async function createUser(user) {
  return await fetch("/api/users.json", {
    method: "POST",
    body: JSON.stringify({ user }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function inviteUser(user) {
  return await fetch("/admin/users/invite.json", {
    method: "POST",
    body: JSON.stringify({ user }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function lookupTwitterUsers(screenname) {
  return await fetch(`/twitter/lookup_users.json?screenname=${screenname}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
