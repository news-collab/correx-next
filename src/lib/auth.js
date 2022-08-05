import { SvelteKitAuth } from "sk-auth";
import { RedditOAuth2Provider } from "sk-auth/providers";
import { TwitterV2AuthProvider } from "./twitterv2";
import { PrismaClient, platform } from '@prisma/client'

export const appAuth = new SvelteKitAuth({
  protocol: import.meta.env.VITE_OAUTH_PROTOTCOL,
  providers: [
    new RedditOAuth2Provider({
      apiKey: import.meta.env.VITE_REDDIT_API_KEY,
      apiSecret: import.meta.env.VITE_REDDIT_API_SECRET,
      duration: "permanent",
      profile(profile, tokens) {
        const slim = RedditOAuth2Provider.profileHandler(profile);
        return { ...slim, tokens: tokens, provider: "reddit" };
      },
    }),
    new TwitterV2AuthProvider({
      apiKey: import.meta.env.VITE_TWITTER_API_KEY,
      apiSecret: import.meta.env.VITE_TWITTER_API_SECRET,
      profile: (profile, tokens) => {
        const slim = TwitterV2AuthProvider.profileHandler(profile);
        return { ...slim, tokens: { oauth_token: tokens.oauth_token, oauth_token_secret: tokens.oauth_token_secret }, provider: "twitter" };
      },
    }),
  ],
  callbacks: {
    async jwt(token, profile) {
      if (profile?.provider) {
        const { provider, ...account } = profile;
        const prisma = new PrismaClient()
        const providerMap = {
          "twitter": platform.TWITTER,
          "reddit": platform.REDDIT,
        };

        let platformWhere;
        let platformFields;
        let tokens;
        if (profile.provider === "twitter") {
          platformWhere = {
            twitter_user_id: profile.id
          }
          platformFields = {
            name: profile.screen_name,
            avatar_url: profile.profile_image_url_https,
            twitter_user_id: profile.id,
            twitter_username: profile.screen_name
          }
          tokens = {
            oauth_token: profile.oauth_token,
            oauth_token_secret: profile.oauth_token_secret
          };
        }

        if (profile.provider === "reddit") {
          platformWhere = {
            reddit_user_id: profile.id
          }
          platformFields = {
            name: profile.name,
            avatar_url: profile.snoovatar_img,
            reddit_user_id: profile.id,
            reddit_username: profile.name
          }
          tokens = {
            access_token: profile.access_token,
            refresh_token: profile.refresh_token
          };
        }

        // Get or create user.
        const user = await prisma.users.upsert({
          create: platformFields,
          update: platformFields,
          where: platformWhere
        });

        token = {
          ...token,
          tokens,
          accessToken: profile.access_token,
          accessTokenExpiration: profile.expires_in,
          user: {
            ...user,
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
