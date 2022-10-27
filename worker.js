import { PrismaClient } from '@prisma/client';
import { setTimeout } from 'timers/promises';
import moment from 'moment';
import { TwitterApi } from 'twitter-api-v2';
import snoowrap from 'snoowrap';
import * as dotenv from 'dotenv';

// Initialize environment variables.
dotenv.config();

// Sleep for 1 minute.
const sleepMS = 60000;
const prisma = new PrismaClient();

async function getTweet(id, config) {
  const client = new TwitterApi(config);
  const tweet = await client.v2.singleTweet(id, {
    expansions: [
      'entities.mentions.username',
      'in_reply_to_user_id',
    ],
    'tweet.fields': [
      'public_metrics',
    ],
    'user.fields': ['username']
  });

  return tweet;
}

async function getTwitterReplies(conversationId, config) {
  const query = encodeURIComponent(`conversation_id:${conversationId}`);
  const client = new TwitterApi(config);

  return await client.v2.search(`conversation_id:${conversationId}`, {
    'media.fields': 'url',
    expansions: ['author_id'],
    'tweet.fields': ['created_at', 'author_id'],
    'user.fields': ['username', 'public_metrics']
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

  const tweet = await getTweet(post.platform_id, config);
  console.log('tweet', tweet);

  post.data.tweet.favorite_count = tweet.data.public_metrics.like_count;
  post.data.tweet.retweet_count = tweet.data.public_metrics.retweet_count;

  await prisma.posts.update({
    where: {
      id: post.id
    },
    data: {
      data: {
        ...post.data
      }
    }
  });
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

  const submission = await client.getSubmission(post.platform_id);
  console.log('submission', submission);
}

async function worker() {
  console.log('processing');
  const lastUpdatedThreshold = moment().subtract(5, 'minutes').utc().toDate();
  const posts = await prisma.posts.findMany({
    where: {
      updated_at: {
        lte: lastUpdatedThreshold
      }
    },
    include: {
      replies: true
    }
  });

  for (let i = 0; i < posts.length; i++) {
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
