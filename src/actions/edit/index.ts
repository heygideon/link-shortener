import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import db from "#/db";
import { links } from "#/db/schema";
import { requireAuth } from "../auth/middleware";
import { withLink } from "./middleware";
import { editLinkSchema } from "./schema";

export const getLink = createServerFn()
  .middleware([requireAuth])
  .inputValidator(z.object({ domain: z.string(), key: z.string() }))
  .handler(async ({ context, data }) => {
    const link = await db.query.links.findFirst({
      where: {
        userId: context.user.id,
        domain: data.domain,
        key: data.key,
      },
    });

    if (!link) {
      throw new Error("Link not found");
    }

    return link;
  });

export const editLink = createServerFn()
  .middleware([withLink])
  .inputValidator(editLinkSchema)
  .handler(async ({ context, data }) => {
    const domain = await db.query.domains.findFirst({
      where: {
        domain: data.domain,
        OR: [{ userId: context.user.id }, { public: true }],
      },
    });
    if (!domain) {
      throw new Error(`Domain ${data.domain} not linked`);
    }

    if (!data.expiration.date) {
      data.expiration.url = "";
    }

    try {
      await db
        .update(links)
        .set({
          domain: data.domain,
          key: data.key,
          url: data.url,

          expirationDate: data.expiration.date || null,
          expirationUrl: data.expiration.url || null,
          password: data.password || null,
          isCloaked: data.isCloaked,
        })
        .where(eq(links.id, context.link.id));
    } catch (_e) {
      throw new Error(`${data.domain}/${data.key} already exists`);
    }
  });

export const deleteLink = createServerFn()
  .middleware([withLink])
  .handler(async ({ context }) => {
    await db.delete(links).where(eq(links.id, context.link.id));
  });
