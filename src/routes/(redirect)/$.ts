import { createFileRoute } from "@tanstack/react-router";
import { renderToStaticMarkup } from "react-dom/server";
import db from "#/db";
import { linkClicks } from "#/db/schema";
import { CloakedTemplate } from "./-cloaked";
import { getMetaTags } from "./-meta";

export const Route = createFileRoute("/(redirect)/$")({
  server: {
    handlers: {
      async GET({ params, request }) {
        if (!params._splat) {
          return new Response("Link not found", { status: 404 });
        }

        const domain = new URL(request.url).hostname;

        const link = await db.query.links.findFirst({
          where: {
            domain,
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

        if (link.isCloaked) {
          const meta = await getMetaTags(link.url);
          const html = renderToStaticMarkup(
            CloakedTemplate({
              url: link.url,
              metaTags: meta,
            }),
          );
          return new Response(`<!DOCTYPE html>${html}`, {
            headers: {
              "Content-Type": "text/html",
            },
          });
        }

        return Response.redirect(new URL(link.url), 302);
      },
    },
  },
});
