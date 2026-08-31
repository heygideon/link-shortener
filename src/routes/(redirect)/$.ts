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

async function getLink(domain: string, key: string) {
  const parts = key.split("/");
  const startsWithOpts = parts.map((_, idx) =>
    parts.slice(0, idx + 1).join("/"),
  );

  const [staticLink, dynamicLinks] = await Promise.all([
    db.query.links.findFirst({
      where: {
        domain,
        key: key.toLowerCase(),
      },
    }),
    db.query.links.findMany({
      where: {
        domain,
        OR: startsWithOpts.map((opt) => ({
          key: {
            like: `${opt.toLowerCase()}%`,
          },
        })),
      },
    }),
  ]);
  if (staticLink) {
    console.log("Static:", `${staticLink.domain}/${staticLink.key}`);
    return staticLink;
  }

  for (const dynamicLink of dynamicLinks) {
    if (!dynamicLink.pattern) continue;

    const regex = new RegExp(dynamicLink.pattern);
    const match = key.match(regex);
    if (match) {
      const dynamicKeys = dynamicLink.key
        .split("/")
        .filter((part) => part.startsWith(":"));
      if (dynamicKeys.length !== match.length - 1) continue;

      console.log(
        "Dynamic:",
        `${dynamicLink.domain}/${dynamicLink.key} (${key})`,
      );

      // /users/:id -> { id: "123" }
      const dynamicParams = dynamicKeys.reduce(
        (acc, key, idx) => {
          acc[key.slice(1)] = match[idx + 1];
          return acc;
        },
        {} as Record<string, string>,
      );

      // https://example.com/users/:id -> https://example.com/users/123
      const url = dynamicLink.url
        .split("/")
        .map((part) => {
          if (part.startsWith(":")) {
            const param = part.slice(1);
            return dynamicParams[param] || part;
          }
          return part;
        })
        .join("/");

      return {
        ...dynamicLink,
        url,
      };
    }
  }

  return null;
}

export const Route = createFileRoute("/(redirect)/$")({
  server: {
    handlers: {
      async GET({ params, request }) {
        if (!params._splat) {
          return new Response("Link not found", { status: 404 });
        }

        const domain = new URL(request.url).hostname;
        const searchParams = new URL(request.url).searchParams;

        const searchPw = searchParams.get("pw");
        searchParams.delete("pw");

        const link = await getLink(domain, params._splat);
        if (!link) {
          return new Response("Link not found", { status: 404 });
        }

        if (link.expirationDate && new Date(link.expirationDate) < new Date()) {
          if (link.expirationUrl) {
            const expirationUrl = new URL(link.expirationUrl);
            for (const [key, value] of searchParams.entries()) {
              expirationUrl.searchParams.set(key, value);
            }
            return Response.redirect(expirationUrl, 302);
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
          if (searchPw) {
            const searchVerified = await verifyPlainPassword(
              link.password,
              searchPw,
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

        const redirectUrl = new URL(link.url);
        for (const [key, value] of searchParams.entries()) {
          redirectUrl.searchParams.set(key, value);
        }

        if (link.isCloaked) {
          const meta = await getMetaTags(link.url);
          const html = renderToStaticMarkup(
            CloakedTemplate({
              url: redirectUrl.toString(),
              metaTags: meta,
            }),
          );
          return new Response(`<!DOCTYPE html>${html}`, {
            headers: {
              "Content-Type": "text/html",
            },
          });
        }

        return Response.redirect(redirectUrl, 302);
      },
    },
  },
});
