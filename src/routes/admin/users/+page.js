/** @type {import('./$types').PageLoad} */
export async function load() {
  const path = `${import.meta.env.VITE_BASE_URL}/api/users`;
  const response = await fetch(path, { credentials: 'include' });

  if (response.ok) {
    const { users } = await response.json();
    return {
      users
    };
  }

  return {
    users: []
  };
}
