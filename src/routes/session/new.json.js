import { serialize } from "cookie";

export async function POST({ request }) {

  const newSessionRequest = await request.json();
  const session = {
    userId: newSessionRequest.userId,
    tokens: newSessionRequest.tokens,
  }

  return {
    status: 302,
    headers: {
      'set-cookie': [serialize('session', JSON.stringify(session), { path: '/' })],
    },
  };
}
