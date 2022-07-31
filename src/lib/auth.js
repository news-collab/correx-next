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
        let userPlatform;

        switch (profile.provider) {
          case "twitter":
            // Get existing user platforms.
            userPlatform = await prisma.user_platforms.findFirst({
              where: {
                platform: platform.TWITTER,
                platform_id: profile.id
              }
            });
            break;
          case "reddit":
            userPlatform = await prisma.user_platforms.findFirst({
              where: {
                platform: platform.REDDIT,
                platform_id: profile.id
              }
            });
            break;
        }

        if (!userPlatform) {

        }

        // Get existing user platforms.
        const userPlatform = await prisma.user_platforms.findUnique({
          where: {
            platform_id:  
        })

        // Create user.
        const userPlatform = await prisma.users.upsert({
          where: {
            platform: providerVal,
            email: 'viola@prisma.io',
          },
          update: {
            name: 'Viola the Magnificent',
          },
          create: {
            email: 'viola@prisma.io',
            name: 'Viola the Magnificent',
          },
        })

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
