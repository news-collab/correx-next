import { SvelteKitAuth } from "sk-auth";
import { RedditOAuth2Provider } from "sk-auth/providers";
import { TwitterV2AuthProvider } from "./twitterv2";

export const appAuth = new SvelteKitAuth({
  protocol: import.meta.env.VITE_OAUTH_PROTOTCOL,
  providers: [
    new RedditOAuth2Provider({
      apiKey: import.meta.env.VITE_REDDIT_API_KEY,
      apiSecret: import.meta.env.VITE_REDDIT_API_SECRET,
      profile(profile) {
        const slim = RedditOAuth2Provider.profileHandler(profile);
        return { ...slim, provider: "reddit" };
      },
    }),
    new TwitterV2AuthProvider({
      apiKey: import.meta.env.VITE_TWITTER_API_KEY,
      apiSecret: import.meta.env.VITE_TWITTER_API_SECRET,
      profile: (profile) => {
        const slim = TwitterV2AuthProvider.profileHandler(profile);
        return { ...slim, provider: "twitterV2" };
      },
    }),
  ],
  callbacks: {
    jwt(token, profile) {
      if (profile?.provider) {
        const { provider, ...account } = profile;
        console.log(`profile`, profile)

        token = {
          ...token,
          user: {
            ...(token.user ?? {}),
            connections: { ...(token.user?.connections ?? {}), [provider]: account },
          },
        };
      }

      return token;
    },
  },
  jwtSecret: import.meta.env.VITE_JWT_SECRET_KEY,
});
