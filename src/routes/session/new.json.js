import { serialize } from "cookie";

export async function POST({ request }) {

  const tokens = await request.json();

  return {
    status: 302,
    headers: {
      'set-cookie': [serialize('tokens', JSON.stringify(tokens), { path: '/' })],
    },
  };
}
