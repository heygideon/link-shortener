import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";
import { ofetch } from "ofetch";
import { joinURL } from "ufo";
import db from "#/db";
import { users } from "#/db/schema";
import { createSession } from "#/lib/session";

interface TokenResponse {
  access_token: string;
  token_type: string;
  id_token: string;
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
  slack_id: string;
  verification_status:
    | "needs_submission"
    | "pending"
    | "verified"
    | "ineligible";
  ysws_eligible: boolean;
}

export const Route = createFileRoute("/app/_app/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const storedState = getCookie("hackclub_state");

        const search = new URL(request.url).searchParams;
        const state = search.get("state");
        const code = search.get("code");
        if (!state || !code || !storedState || state !== storedState) {
          throw redirect({
            to: "/",
            search: { auth_error: "Invalid request" },
          });
        }

        try {
          const baseUrl = new URL(request.url).origin;
          const { access_token } = await ofetch<TokenResponse>(
            "https://auth.hackclub.com/oauth/token",
            {
              method: "POST",
              body: {
                client_id: process.env.HACKCLUB_CLIENT_ID,
                client_secret: process.env.HACKCLUB_CLIENT_SECRET,
                redirect_uri: joinURL(baseUrl, "/app/auth/callback"),
                code,
                grant_type: "authorization_code",
              },
            },
          );
          const user = await ofetch<UserInfoResponse>(
            "https://auth.hackclub.com/oauth/userinfo",
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            },
          );

          if (user.verification_status !== "verified") {
            throw redirect({
              to: "/",
              search: { auth_error: "Your account is not ID verified" },
            });
          }

          await db
            .insert(users)
            .values({
              id: user.sub,
              email: user.email,
              firstName: user.given_name,
              lastName: user.family_name,
              slackId: user.slack_id,
            })
            .onConflictDoNothing({ target: users.id });

          await createSession(user.sub);
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
