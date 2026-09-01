import { createFileRoute, redirect } from "@tanstack/react-router";
import { setCookie } from "@tanstack/react-start/server";
import { nanoid } from "nanoid";
import { joinURL, withQuery } from "ufo";
import { getSession } from "#/lib/session";
import { baseUrl } from "..";

export const Route = createFileRoute("/app/_app/auth/yth/")({
  server: {
    handlers: {
      GET: async () => {
        const { session } = await getSession();
        if (session) {
          throw redirect({
            to: "/app",
          });
        }

        const state = nanoid();
        setCookie("yth_state", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        // ?client_id=your_client_id&redirect_uri=https%3A%2F%2Farcade.hackclub.com%2Fauth%2Fcallback&response_type=code&scope=openid+profile+email
        const redirectUrl = withQuery(
          "https://yth-auth.fly.dev/oauth/authorize",
          {
            client_id: process.env.YTH_CLIENT_ID,
            redirect_uri: joinURL(baseUrl, "/app/auth/yth/callback"),
            response_type: "code",
            scope: "profile email",
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
