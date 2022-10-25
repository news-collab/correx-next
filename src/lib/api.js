export async function getUserSubjects(user) {
  return await fetch(`subjects.json`, {
    credentials: 'include'
  });
}

export async function getConversation(subjectId, postId) {
  return await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/subjects/${subjectId}/posts/${postId}/replies`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export async function getRedditReplies(subjectId, postId, replyId) {
  return await fetch(
    `${import.meta.env.VITE_BASE_URL
    }/api/subjects/${subjectId}/posts/${postId}/replies/${replyId}/reddit-comments`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export async function getTwitterReplies(subjectId, postId, replyId) {
  return await fetch(
    `${import.meta.env.VITE_BASE_URL
    }/api/subjects/${subjectId}/posts/${postId}/replies/${replyId}/twitter-comments`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export async function updateUser(user) {
  return fetch(`users/${user.id}.json`, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function createUser(user) {
  return await fetch('/api/users.json', {
    method: 'POST',
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function inviteUser(user) {
  return await fetch('/admin/users/invite.json', {
    method: 'POST',
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function lookupTwitterUsers(screenname) {
  return await fetch(`/twitter/lookup_users.json?screenname=${screenname}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function updatePost(post) {
  const body = JSON.stringify(post);

  return await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/subjects/${post.subject_id}/posts/${post.id}`,
    {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export async function starPosts(subjectId, postIds) {
  const body = JSON.stringify({
    subjectId,
    postIds
  });

  return await fetch(`${import.meta.env.VITE_BASE_URL}/api/subjects/${subjectId}/posts/starred`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function signup(body) {
  return await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function login(body) {
  return await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function removeIntegration(integration) {
  return await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/${integration}/remove`, {
    method: 'POST'
  });
}

export async function reply(post, reply) {
  const path = `${import.meta.env.VITE_BASE_URL}/api/subjects/${post.subject_id}/posts/${post.id
    }/replies`;

  return await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reply
    })
  });
}

export async function me() {
  return await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
