import { createFileRoute, redirect } from "@tanstack/react-router";
import { setCookie } from "@tanstack/react-start/server";
import { nanoid } from "nanoid";
import { joinURL, withQuery } from "ufo";
import { getSession } from "#/lib/session";

export const Route = createFileRoute("/app/_app/auth/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { session } = await getSession();
        if (session) {
          throw redirect({
            to: "/app",
          });
        }

        const state = nanoid();
        setCookie("hackclub_state", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        const baseUrl = new URL(request.url).origin;

        // ?client_id=your_client_id&redirect_uri=https%3A%2F%2Farcade.hackclub.com%2Fauth%2Fcallback&response_type=code&scope=openid+profile+email
        const redirectUrl = withQuery(
          "https://auth.hackclub.com/oauth/authorize",
          {
            client_id: process.env.HACKCLUB_CLIENT_ID,
            redirect_uri: joinURL(baseUrl, "/app/auth/callback"),
            response_type: "code",
            scope: "openid profile email slack_id verification_status",
            state,
          },
        );

        throw redirect({
          href: redirectUrl,
        });
      },
    },
  },
});
