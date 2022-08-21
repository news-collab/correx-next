<script>
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import FaTwitterSquare from 'svelte-icons/fa/FaTwitter.svelte';
	import Tweet from '../../../components/Tweet.svelte';
	import SelectableTable from '../../../components/SelectableTable/SelectableTable.svelte';
	import BreadCrumbs from '../../../components/Source/Breadcrumbs.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const { subject } = data;

	let twttrReady = false;
	let enableTweeting = false;
	let mode = 'picker';

	let posts = {
		facebook: [],
		twitter: []
	};
	let displayPlatform = 'Twitter';

	let fb_table_items = [];
	let fb_table_attributes = {};
	let fb_selected_items = [];
	let twitter_table_items = [];
	let twitter_table_attributes = {};
	let twitter_selected_items = [];

	let displayTweets = []; //writable([{ user: {} }]);
	let myStore = writable(null);

	function dump() {
		debugger;
	}

	onMount(async () => {
		posts.twitter = data.twitter || [];
		displayTweets = [(posts.twitter[0] || {}).data];
		//subject = data.subject;

		twitter_table_items = posts.twitter.map((post) => {
			const tweet = post.data;
			return {
				checked: post.starred,
				followers: tweet.user.followers_count || 0,
				favorites: tweet.favorite_count || 0,
				retweets: tweet.retweet_count || 0,
				replies: '?',
				published_time: new Date(tweet.created_at),
				tweet: tweet,
				post: post
				//text:           tweet.text,
				//id:             tweet.id
			};
		});

		twitter_table_attributes = {
			followers: 'Followers',
			retweets: 'Retweets',
			favorites: 'Favorites'
			//'replies': 'Replies',
			//'id': "ID",
			//"text": "text",
			//'published_time': 'Published'
		};

		await tick();
		const { localStorageWritableJSON } = await import(
			'../../../components/writableLocalStorage.ts'
		);
		myStore = localStorageWritableJSON('myStore');
		myStore.set('Oh Hi!');
	});

	function loadTweet(entry) {
		displayTweets = [entry.item.post.data];
	}

	async function saveSelection(item) {
		const post = item.item.post;
		post.starred = item.checked;
		const postEndpoint = `/subject/${source_id}/followup/posts.json`;
		const response = await fetch(postEndpoint, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ posts: [post] })
		});
		const saved = await response.json();
	}

	let message = `Type your message to people you want to send a correction to their followers`;

	function setMode(input) {
		mode = input;
	}

	function twttrLoaded() {
		twttrReady = true;
		twitter_table_items = twitter_table_items;
	}
</script>

<svelte:head>
	<script src="https://platform.twitter.com/widgets.js" on:load={twttrLoaded}></script>
</svelte:head>

<h1>
	{(subject && subject.metadata && subject.metadata.title) || subject.url}
</h1>
<BreadCrumbs id={subject.id} active={'results'} />
<section>
	<div class="lists">
		<!--
    <div id="platform-list">
      <div
        class:selected={displayPlatform == "Twitter"}
        class="icon-wrapper"
        on:click={() => {
          displayPlatform = "Twitter";
        }}
      >
        <img src="/icons/twitter-square-brands.svg" alt="twitter icon" /> Twitter
      </div>
      <div
        class:selected={displayPlatform == "Facebook"}
        class="icon-wrapper"
        on:click={() => {
          displayPlatform = "Facebook";
        }}
      >
        <img src="/icons/facebook-square-brands.svg" alt="facebook icon" /> Facebook
      </div>
    </div>
  -->
		<div id="facebook-list" class="platform-list" class:hidden={displayPlatform !== 'Facebook'}>
			<h2>Coming Soon!</h2>
		</div>

		<div id="twitter-list" class="platform-list" class:hidden={displayPlatform !== 'Twitter'}>
			<SelectableTable
				items={twitter_table_items}
				attributes={twitter_table_attributes}
				bind:selected={twitter_selected_items}
				onClick={loadTweet}
				onSelect={saveSelection}
				activeIcon={FaTwitterSquare}
				activeItem={0}
			/>
		</div>
	</div>

	{#if twttrReady}
		<div class="display">
			{#each displayTweets as tweet}
				<Tweet {tweet} />
			{/each}
		</div>
	{/if}
</section>

<style>
	#platform-list {
		display: flex;
	}
	#platform-list div {
		padding: 8px;
		text-decoration: underline;
		cursor: pointer;
	}

	.hidden {
		display: none;
	}

	.icon-wrapper {
		padding-top: 8px;
	}

	.icon-wrapper img {
		height: 18px;
		width: 18px;
		margin: 4px;
	}

	#platform-list > div {
		display: flex;
		align-items: center;
	}

	.selected {
		font-weight: bold;
	}

	section {
		display: flex;
	}

	/*textarea {
    min-height: 5em;
    min-width: 600px;
    font-size: 16px;
    padding: 16px;
    margin: auto;
  }

  .tweet {
    border: 1px solid black;
    margin: 8px;
    padding: 8px;
    border-radius: 4px;
  }

  button {
    font-size: 16px;
  }

  hr {
    margin: 16px;
  }*/

	#twitter-list {
		margin-right: 20px;
	}
</style>
