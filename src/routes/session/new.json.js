export async function POST({ request }) {

  const tokens = await request.json();

  return {
    status: 302,
    headers: {
      'set-cookie': [`tokens=${JSON.stringify(tokens)}`],
    },
  };
}
