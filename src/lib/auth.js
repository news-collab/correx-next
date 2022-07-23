import { SvelteKitAuth } from "sk-auth";
import { TwitterAuthProvider } from "sk-auth/providers";
import { TwitterApi } from 'twitter-api-v2';

export const appAuth = new SvelteKitAuth({
  providers: [
    new class extends TwitterAuthProvider {
      constructor() {
        super({
          apiKey: import.meta.env.VITE_TWITTER_API_KEY,
          apiSecret: import.meta.env.VITE_TWITTER_API_SECRET,
          profile: (profile) => {
            return { ...profile, provider: 'twitter' };
          },
        })
      }
      getRequestToken = async (auth, host) => {
        const { url, ...oauthResult } = await (new TwitterApi({
          appKey: this.config.apiKey,
          appSecret: this.config.apiSecret
        })).readOnly.generateAuthLink(
          encodeURIComponent(this.getCallbackUri()), { authAccessType: 'read' }
        );
        return {
          oauthToken: oauthResult.oauth_token,
          oauthTokenSecret: oauthResult.oauth_token_secret,
          oauthCallbackConfirmed: oauthResult.oauth_callback_confirmed
        };
      }
      getTokens = async (oauthToken, oauthVerifier) => {
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
      getUserProfile = async ({ oauth_token, oauth_token_secret, ...account }) => {
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
          // 403
        }
        return { ...user, ...account };
      }
      getCallbackUri() {
        return `/api/auth/twitter`;
      }
    },
  ],
  jwtSecret: import.meta.env.VITE_JWT_SECRET_KEY,
});
