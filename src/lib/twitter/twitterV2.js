import Twitter from "twitter-v2";
import TwitterApi from 'twitter-api-v2';
import * as dotenv from 'dotenv';
dotenv.config();

export const defaultAvatarUrl = "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";

export function newTwitterClient(userToken, userTokenSecret) {
  const clientConfig = {
    consumer_key: import.meta.env.VITE_TWITTER_API_KEY,
    consumer_secret: import.meta.env.VITE_TWITTER_API_SECRET,
    access_token_key: userToken,
    access_token_secret: userTokenSecret,
  };

  return new Twitter(clientConfig);
}

export function newTwitterAPI(userToken, userTokenSecret) {
  const config = {
    appKey: import.meta.env.VITE_TWITTER_API_KEY,
    appSecret: import.meta.env.VITE_TWITTER_API_SECRET,
    accessToken: userToken,
    accessSecret: userTokenSecret,
  };

  return new TwitterApi(config);
}

export async function getTweets(postURL, user) {
  const client = newTwitterClient(user.token, user.tokenSecret);

  const queryOptions = {
    query: `${postURL} -filter:retweets`,
  };
  try {
    return await client.get("tweets/search/recent", queryOptions);
  } catch (error) {
    console.error(`error getting tweets: ${error}`);
    return {
      statuses: [],
    };
  }
}

export async function search(url, tokens) {
  const client = newTwitterClient(tokens.oauthToken, tokens.oauthTokenSecret);

  const query = encodeURIComponent(`url:"${url}" -is:retweet`);
  const tweetFields = ["created_at", "public_metrics"];
  const userFields = ["username", "public_metrics"]

  try {
    return await client.get(`tweets/search/recent?query=${query}&expansions=author_id&tweet.fields=${tweetFields.join(",")}&user.fields=${userFields.join(",")}`);
  } catch (error) {
    console.error(`error getting tweets: ${error}`);
    return {
      statuses: [],
    };
  }
}

export async function getConversation(conversationId, user) {
  const client = newTwitterClient(user.token, user.tokenSecret);

  const query = encodeURIComponent(`conversation_id:${conversationId}`);
  const tweetFields = [
    "in_reply_to_user_id",
    "author_id",
    "conversation_id",
    "created_at",
  ];
  const userFields = ["username", "public_metrics"]

  try {
    return await client.get(`tweets/search/recent?query=${query}&expansions=author_id&tweet.fields=${tweetFields.join(",")}&user.fields=${userFields.join(",")}`);
  } catch (error) {
    console.error(`error getting tweets: ${error}`);
    return {
      data: [],
    };
  }
}

export async function reply(data, user) {
  const client = newTwitterAPI(user.twitter_access_token, user.twitter_access_secret);
  return await client.v1.reply(data.status, data.in_reply_to_status_id);
}

export async function lookupUsers(screenname, user) {
  const config = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: user.token,
    access_token_secret: user.tokenSecret,
  };
  const client = new Twitter(config);

  const userParams = {
    screen_name: screenname,
  };

  return await client.get("users/lookup", userParams);
}

export async function sendDirectMessage(message, invitee, user) {
  const config = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: user.token,
    access_token_secret: user.tokenSecret,
  };
  const client = new Twitter(config);
  const event = {
    type: "message_create",
    message_create: {
      target: {
        recipient_id: invitee.twitterId,
      },
      message_data: {
        text: message,
      },
    },
  };

  return await client.post("direct_messages/events/new.json", event);
}
