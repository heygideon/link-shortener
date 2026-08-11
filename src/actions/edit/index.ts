import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import db from "#/db";
import { links } from "#/db/schema";
import { editLinkSchema } from "./schema";
import { withLink } from "./middleware";
import { requireAuth } from "../auth/middleware";
import z from "zod";

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
      columns: {
        id: true,
        domain: true,
        key: true,
        url: true,
        archived: true,
        createdAt: true,
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
    await db
      .update(links)
      .set({
        domain: data.domain,
        key: data.key,
        url: data.url,
      })
      .where(eq(links.id, context.link.id));
  });

export const deleteLink = createServerFn()
  .middleware([withLink])
  .handler(async ({ context }) => {
    await db.delete(links).where(eq(links.id, context.link.id));
  });
