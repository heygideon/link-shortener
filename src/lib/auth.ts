import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    tanstackStartCookies(),
    genericOAuth({
      config: [
        {
          providerId: "hackclub",
          discoveryUrl:
            "https://auth.hackclub.com/.well-known/openid-configuration",
          // biome-ignore lint/style/noNonNullAssertion: defined in .env
          clientId: process.env.HACKCLUB_CLIENT_ID!,
          clientSecret: process.env.HACKCLUB_CLIENT_SECRET,
          scopes: ["openid", "profile", "email", "slack_id"],
        },
      ],
    }),
  ],
});
