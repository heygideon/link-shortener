import { timingSafeEqual } from "node:crypto";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { renderToStaticMarkup } from "react-dom/server";
import db from "#/db";
import { linkClicks } from "#/db/schema";
import { CloakedTemplate } from "./-cloaked";
import { getMetaTags } from "./-meta";

export async function verifyPlainPassword(one: string, two: string) {
  const oneHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(one),
  );
  const twoHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(two),
  );
  return timingSafeEqual(Buffer.from(oneHash), Buffer.from(twoHash));
}

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

        if (link.expirationDate && new Date(link.expirationDate) < new Date()) {
          if (link.expirationUrl) {
            return Response.redirect(new URL(link.expirationUrl), 302);
          } else {
            return Response.redirect(
              new URL(
                `/app/expired?key=${encodeURIComponent(link.key)}`,
                request.url,
              ),
              302,
            );
          }
        }

        if (link.password) {
          const cookie = getCookie(`${link.key}-password`);
          const search = new URL(request.url).searchParams.get("pw");

          let passwordVerified = false;

          if (cookie) {
            const cookieVerified = await verifyPlainPassword(
              link.password,
              cookie,
            );
            if (cookieVerified) {
              passwordVerified = true;
            }
          }
          if (search) {
            const searchVerified = await verifyPlainPassword(
              link.password,
              search,
            );
            if (searchVerified) {
              setCookie(`${link.key}-password`, link.password, {
                path: "/",
                httpOnly: true,
              });

              const url = new URL(request.url);
              url.searchParams.delete("pw");

              // Use built-in redirect to handle setCookie above
              throw redirect({
                href: url.toString(),
                replace: true,
                statusCode: 302,
              });
            }
          }

          if (!passwordVerified) {
            return Response.redirect(
              new URL(
                `/app/password?key=${encodeURIComponent(link.key)}`,
                request.url,
              ),
              302,
            );
          }
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
