import Twitter from "twitter-v2";
import * as dotenv from 'dotenv';
dotenv.config();

export const defaultAvatarUrl = "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";

export function newTwitterClient(userToken, userTokenSecret) {
  const clientConfig = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: userToken,
    access_token_secret: userTokenSecret,
  };
  return new Twitter(clientConfig);
}

export async function getTweets(postURL, user) {
  const client = newTwitterClient(user.token, user.tokenSecret);

  const queryOptions = {
    query: `${postURL} -filter:retweets`,
  };
  try {
    return await client.get("tweets/search/recent", queryOptions);
  } catch (error) {
    console.log(`error getting tweets: ${error}`);
    return {
      statuses: [],
    };
  }
}

export async function search(url, user) {
  const client = newTwitterClient(user.token, user.tokenSecret);

  const query = encodeURIComponent(`url:"${url}" -is:retweet`);
  const tweetFields = ["created_at", "public_metrics"];
  const userFields = ["username", "public_metrics"]

  try {
    return await client.get(`tweets/search/recent?query=${query}&expansions=author_id&tweet.fields=${tweetFields.join(",")}&user.fields=${userFields.join(",")}`);
  } catch (error) {
    console.log(`error getting tweets: ${error}`);
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
    console.log(`tweets/search/recent?query=${query}&tweet.fields=${tweetFields.join(",")}`)
    return await client.get(`tweets/search/recent?query=${query}&expansions=author_id&tweet.fields=${tweetFields.join(",")}&user.fields=${userFields.join(",")}`);
  } catch (error) {
    console.log(`error getting tweets: ${error}`);
    return {
      data: [],
    };
  }
}

export async function sendTweets(data, user) {
  const client = newTwitterClient(user.token, user.tokenSecret);
  const tweetData = {
    status: data.status,
    in_reply_to_status_id: data.in_reply_to_status_id,
    auto_populate_reply_metadata: data.auto_populate_reply_metadata,
  };
  return await client.post("statuses/update", tweetData);
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
  console.log(config);
  console.log(event);

  return await client.post("direct_messages/events/new.json", event);
}
