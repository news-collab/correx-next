import { newTwitterClient } from "./twitterV2.js";

test('test twitter credentials are set', () => {
	const client = newTwitterClient("123", "456");
	expect(client.credentials._consumer_key).toBe("abc");
	expect(client.credentials._consumer_secret).toBe("def");
	expect(client.credentials._access_token_key).toBe("123");
	expect(client.credentials._access_token_secret).toBe("456");
});
