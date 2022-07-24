import { TwitterAuthProvider } from "sk-auth/providers";
import { TwitterApi } from 'twitter-api-v2';

const twitterProfileHandler = ({ id, id_str, name, screen_name, description, profile_image_url, profile_image_url_https, verified }) => ({
  id, id_str, name, screen_name, description, profile_image_url, profile_image_url_https, verified
});

const defaultConfig = {
  id: "twitterV2",
  profile: twitterProfileHandler,
}

export class TwitterV2AuthProvider extends TwitterAuthProvider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    })
  }
  async getRequestToken(auth, host, state) {
    const { url, ...oauthResult } = await (new TwitterApi({
      appKey: this.config.apiKey,
      appSecret: this.config.apiSecret
    })).readOnly.generateAuthLink(
      encodeURIComponent(this.getCallbackUri(auth, host, state)), { authAccessType: 'read' }
    );
    return {
      oauthToken: oauthResult.oauth_token,
      oauthTokenSecret: oauthResult.oauth_token_secret,
      oauthCallbackConfirmed: oauthResult.oauth_callback_confirmed
    };
  }
  getCallbackUri(svelteKitAuth, host, state) {
    return this.getUri(svelteKitAuth, `${"/callback/"}${this.id}?state=${state}`, host);
  }
  async getAuthorizationUrl({ url }, auth, state, nonce) {
    const endpoint = "https://api.twitter.com/oauth/authorize";
    const { oauthToken } = await this.getRequestToken(auth, url.host, state);
    const data = {
      oauth_token: oauthToken,
      redirect_uri: this.getCallbackUri(auth, url.host, state),
    };
    const authUrl = `${endpoint}?${new URLSearchParams(data)}`;
    return authUrl;
  }
  async getTokens(oauthToken, oauthVerifier) {
    const endpoint = 'https://api.twitter.com/oauth/access_token';

    const data = {
      oauth_consumer_key: this.config.apiKey,
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    };

    const response = await fetch(`${endpoint}?${new URLSearchParams(data)}`, { method: 'POST' });
    // This endpoint returns query string like key-value pairs
    // https://developer.twitter.com/en/docs/authentication/api-reference/access_token
    return Object.fromEntries([...(new URLSearchParams(await response.text()))]);
  }
  async getUserProfile({ oauth_token, oauth_token_secret, ...account }) {
    let user = {};
    try {
      // Need to apply for elevated access - not tested yet
      user = await (new TwitterApi({
        appKey: this.config.apiKey,
        appSecret: this.config.apiSecret,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret,
      })).readOnly.currentUser();
    } catch (e) {
      console.log('oh my, there was a problem', e)
      // 403
    }

    return { ...user, ...account };
  }
  async callback(event, auth) {
    const { url } = event;
    const oauthToken = url.searchParams.get("oauth_token");
    const oauthVerifier = url.searchParams.get("oauth_verifier");
    const redirect = this.getStateValue(url.searchParams, "redirect");
    const tokens = await this.getTokens(oauthToken, oauthVerifier);
    let user = await this.getUserProfile(tokens);
    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }
    return [user, redirect ?? this.getUri(auth, "/", url.host)];
  }
}

TwitterV2AuthProvider.profileHandler = twitterProfileHandler;
