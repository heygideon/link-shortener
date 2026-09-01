import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";
import { ofetch } from "ofetch";
import { joinURL } from "ufo";
import db from "#/db";
import { createSession } from "#/lib/session";

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}
interface UserInfoResponse {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  nickname: string;
  updated_at: number;
}

export const Route = createFileRoute("/app/_app/auth/yth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const storedState = getCookie("yth_state");

        const search = new URL(request.url).searchParams;
        const state = search.get("state");
        const code = search.get("code");
        if (!state || !code || !storedState || state !== storedState) {
          throw redirect({
            to: "/",
            search: { auth_error: "Invalid request" },
          });
        }

        const baseUrl = new URL(request.url).origin;
        try {
          const { access_token } = await ofetch<TokenResponse>(
            "https://yth-auth.fly.dev/oauth/token",
            {
              method: "POST",
              body: {
                client_id: process.env.YTH_CLIENT_ID,
                client_secret: process.env.YTH_CLIENT_SECRET,
                redirect_uri: joinURL(baseUrl, "/app/auth/yth/callback"),
                code,
                grant_type: "authorization_code",
              },
            },
          );
          const user = await ofetch<UserInfoResponse>(
            "https://yth-auth.fly.dev/oauth/userinfo",
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            },
          );

          const existingUser = await db.query.users.findFirst({
            where: { email: user.email },
          });
          if (!existingUser) {
            throw redirect({
              to: "/",
              search: {
                auth_error: `Hi ${user.given_name}! Sign in first with Hack Club (with the same email) to check you're <18 ^-^`,
              },
            });
          }

          await createSession(existingUser.id);
        } catch (_e) {
          if (isRedirect(_e)) {
            throw _e;
          }

          console.error(_e);
          throw redirect({
            to: "/",
            search: { auth_error: "Internal error" },
          });
        }

        throw redirect({ to: "/" });
      },
    },
  },
});
