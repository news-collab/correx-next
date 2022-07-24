export async function GET(e) {
  return {
    status: 200,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: {
      e
    }
  };
}
