import { PrismaClient } from '@prisma/client';
import { setTimeout } from 'timers/promises';
import moment from 'moment';
import { TwitterApi } from 'twitter-api-v2';
import snoowrap from 'snoowrap';
import * as dotenv from 'dotenv';

// Initialize environment variables.
dotenv.config();
console.log('env');
// Sleep for 1 minute.
const sleepMS = 60000;
const prisma = new PrismaClient();

async function getConversation(conversationId, config) {
  const query = encodeURIComponent(`conversation_id:${conversationId}`);
  const client = new TwitterApi(config);

  return await client.v2.search(`conversation_id:${conversationId}`, {
    'media.fields': 'url',
    expansions: ['author_id'],
    'tweet.fields': ['created_at'],
    'user.fields': ['username']
  });
}

async function updateTwitterPost(post) {
  const user = await prisma.users.findUnique({
    where: {
      id: post.user_id
    }
  });

  const config = {
    appKey: process.env.VITE_TWITTER_API_KEY,
    appSecret: process.env.VITE_TWITTER_API_SECRET,
    accessToken: user.twitter_access_token,
    accessSecret: user.twitter_access_secret
  };

  const tweets = await getConversation(post.platform_id, config);
  for await (const tweet of tweets) {
    console.log('tweet', tweet);
    const authorUser = tweets.includes.author(tweet);
    const replyData = {
      platform: 'TWITTER',
      platform_id: tweet.id,
      post_id: post.id,
      data: {
        body: tweet.text,
        permalink: `https://www.twitter.com/${authorUser.username}/statuses/${tweet.id}`,
        created_at: tweet.created_at,
        author_id: tweet.author_id,
        author_username: authorUser.username
      },
      created_at: moment(tweet.created_at).utc().toDate()
    };
    console.log('replyData', replyData);
    await prisma.replies.upsert({
      where: {
        platform_id: replyData.platform_id
      },
      create: replyData,
      update: replyData
    });
  }
  /*await prisma.posts.update({
    data: {
      updated_at: moment().utc().toDate()
    },
    where: {
      id: post.id
    }
  });*/
}

// Update post with Reddit submission conversation.
async function updateRedditPost(post) {
  const user = await prisma.users.findUnique({
    where: {
      id: post.user_id
    }
  });

  const config = {
    appKey: process.env.VITE_TWITTER_API_KEY,
    appSecret: process.env.VITE_TWITTER_API_SECRET,
    accessToken: user.reddit_access_token,
    accessSecret: user.reddit_refresh_token
  };

  const client = new snoowrap({
    clientId: process.env.VITE_REDDIT_API_KEY,
    clientSecret: process.env.VITE_REDDIT_API_SECRET,
    refreshToken: user.reddit_refresh_token,
    userAgent: 'Correx for Reddit 1.0 by News Collab'
  });

  const submissions = await getConversation(post.platform_id, config);
  for await (const tweet of tweets) {
    console.log('tweet', tweet);
    const authorUser = tweets.includes.author(tweet);
    const replyData = {
      platform: 'TWITTER',
      platform_id: tweet.id,
      post_id: post.id,
      data: {
        body: tweet.text,
        permalink: `https://www.twitter.com/${authorUser.username}/statuses/${tweet.id}`,
        created_at: tweet.created_at,
        author_id: tweet.author_id,
        author_username: authorUser.username
      },
      created_at: moment(tweet.created_at).utc().toDate()
    };
    console.log('replyData', replyData);
    await prisma.replies.upsert({
      where: {
        platform_id: replyData.platform_id
      },
      create: replyData,
      update: replyData
    });
  }
  /*await prisma.posts.update({
    data: {
      updated_at: moment().utc().toDate()
    },
    where: {
      id: post.id
    }
  });*/
}

async function worker() {
  console.log('processing');
  const lastUpdatedThreshold = moment().subtract(5, 'minutes').utc().toDate();
  const posts = await prisma.posts.findMany({
    where: {
      updated_at: {
        lte: lastUpdatedThreshold
      }
    }
  });

  for (var i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`post: ${post.id} updated: ${post.updated_at}`);

    if (post.platform === 'TWITTER') {
      await updateTwitterPost(post);
    }

    if (post.platform === 'REDDIT') {
      await updateRedditPost(post);
    }
  }

  console.log('sleeping for 1 minute');
}

while (true) {
  await worker();
  await setTimeout(sleepMS, true);
}
