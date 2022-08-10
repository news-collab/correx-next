import { isURL } from "./validation";

test('isURL', () => {
  expect(isURL('123')).toEqual(false);
  expect(isURL('http://google.com')).toEqual(true);
  expect(isURL('https://google.com')).toEqual(true);
});
