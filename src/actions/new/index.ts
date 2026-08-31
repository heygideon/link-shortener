import { createServerFn } from "@tanstack/react-start";
import db from "#/db";
import { links } from "#/db/schema";
import { genLinkKey, getDynamicLinkData } from "#/lib/link";
import { requireAuth } from "../auth/middleware";
import { editLinkSchema } from "../edit/schema";

export const createLink = createServerFn({ method: "POST" })
  .inputValidator(editLinkSchema)
  .middleware([requireAuth])
  .handler(async ({ data, context }) => {
    const key = data.key || genLinkKey();

    const domain = await db.query.domains.findFirst({
      where: {
        domain: data.domain,
        OR: context.user.isAdmin
          ? []
          : [{ userId: context.user.id }, { public: true }],
      },
    });
    if (!domain) {
      throw new Error(`Domain ${data.domain} not linked`);
    }

    if (!data.expiration.date) {
      data.expiration.url = "";
    }

    const { normalisedKey, pattern } = getDynamicLinkData(data.key);

    if (pattern && domain.userId !== context.user.id && !context.user.isAdmin) {
      throw new Error("Dynamic links are not allowed on public domains");
    }

    try {
      await db.insert(links).values({
        domain: data.domain,
        key,
        url: data.url,
        userId: context.user.id,
        normalisedKey,
        pattern,

        expirationDate: data.expiration.date || null,
        expirationUrl: data.expiration.url || null,
        password: data.password || null,
        isCloaked: data.isCloaked,
      });
    } catch (_e) {
      throw new Error(`${data.domain}/${data.key} already exists`);
    }
  });
