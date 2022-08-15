<script>
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { getConversation } from '@/api';

	export let tweet = {
		text: 'dummy text',
		lang: 'en',
		user: {
			screen_name: 'user',
			name: 'user'
		}
	};

	let wrapper;
	let conversation = [];

	function templateTweet(tweet) {
		if (tweet && tweet.user) {
			const tweetLink = document.createElement('a');
			tweetLink.href = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
			tweetLink.textContent = tweet.created_at;
			tweetLink.dataset.height = '200px';

			const blockquote = document.createElement('blockquote');
			blockquote.className = 'twitter-tweet';
			blockquote.appendChild(tweetLink);
			blockquote.dataset.conversation = 'none';
			blockquote.dataset.cards = 'hidden';
			blockquote.dataset.height = '200';
			wrapper.innerHTML = '';
			wrapper.appendChild(blockquote);
		} else {
			console.log('No tweet or user');
		}
	}

	$: {
		console.log('tweet', tweet);
		if (twttr && wrapper && tweet && tweet.user) {
			wrapper.innerHTML = '';
			templateTweet(tweet);
			twttr.widgets.load();
			//console.log(tweet.id_str);
			//getConvo(tweet.id_str);
		} else {
			console.log("wrapper doesn't exist");
		}
	}
</script>

{#if tweet && tweet.user}
	<div bind:this={wrapper} class="tweet-wrapper tweet-{tweet.id_str}" />
{:else}
	<div>error loading tweet</div>
{/if}

<style>
	.tweet-wrapper {
		height: inherit;
	}
</style>
