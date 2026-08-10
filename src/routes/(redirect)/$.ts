import { createFileRoute } from "@tanstack/react-router";
import db from "#/db";
import { linkClicks } from "#/db/schema";

export const Route = createFileRoute("/(redirect)/$")({
  server: {
    handlers: {
      async GET({ params }) {
        if (!params._splat) {
          return new Response("Link not found", { status: 404 });
        }

        const link = await db.query.links.findFirst({
          where: {
            domain: "heya.gdn",
            key: params._splat,
          },
        });
        if (!link) {
          return new Response("Link not found", { status: 404 });
        }

        // TODO: use waitUntil
        await db.insert(linkClicks).values({
          linkId: link.id,
        });

        return Response.redirect(new URL(link.url), 302);
      },
    },
  },
});
