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
        return { ...slim, provider: "twitter" };
      },
    }),
  ],
  callbacks: {
    async jwt(token, profile) {
      if (profile?.provider) {
        const { provider, ...account } = profile;
        console.log(`profile`, profile)
        console.log(`token`, token);

        const prisma = new PrismaClient()
        const providerMap = {
          "twitter": platform.TWITTER,
          "reddit": platform.REDDIT,
        };

        let platformWhere;
        let platformFields;
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
        }

        if (profile.provider === "reddit") {
          platformWhere = {
            reddit_user_id: profile.id
          }
          platformFields = {
            name: profile.name,
            avatar_url: profile.snoovatar_img,
            reddit_user_id: profile.id,
            reddit_useername: profile.name
          }
        }

        // Get user
        const user = await prisma.users.upsert({
          create: platformFields,
          update: platformFields,
          where: platformWhere
        });

        token = {
          ...token,
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
