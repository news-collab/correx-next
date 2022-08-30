import { parse } from "cookie";

export function getUserSession(headers) {
  const cookies = parse(headers.get('cookie') || '');
  return cookies.session ? JSON.parse(cookies.session) : null;
}
