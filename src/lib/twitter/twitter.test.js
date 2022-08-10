import { getClient } from "./twitter.js";

test('test twitter credentials are set', () => {
	const client = getClient("123", "456");
	expect(client.options.consumer_key).toBe("abc");
	expect(client.options.consumer_secret).toBe("def");
	expect(client.options.access_token_key).toBe("123");
	expect(client.options.access_token_secret).toBe("456");
});
