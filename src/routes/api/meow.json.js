import { parse, serialize } from 'cookie';

export function GET(event) {
  const cookies = parse(event.request.headers.get('cookie') || '');

  return {
    status: 200,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: {
      cat: {
        says: "meow"
      }
    }
  };
}
