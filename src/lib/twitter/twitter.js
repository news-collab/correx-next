import Twitter from "twitter";
import * as dotenv from 'dotenv';
dotenv.config();

export function getClient(userToken, userTokenSecret) {
  const clientConfig = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: userToken,
    access_token_secret: userTokenSecret,
  };
  return new Twitter(clientConfig);
}

export async function getTweets(postURL, user) {
  const client = getClient(user.token, user.tokenSecret);

  const queryOptions = {
    q: `${postURL} -filter:retweets`,
  };
  try {
    return await client.get("search/tweets", queryOptions);
  } catch (error) {
    console.error(`error getting tweets: ${JSON.stringify(error)}`);
    return {
      statuses: [],
    };
  }
}

export async function sendTweets(data, user) {
  const client = getClient(user.token, user.tokenSecret);
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

  return await client.post("direct_messages/events/new.json", event);
}
