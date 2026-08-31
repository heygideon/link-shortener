import { createServerFn } from "@tanstack/react-start";
import db from "#/db";
import { links } from "#/db/schema";
import { genLinkKey } from "#/lib/link";
import { createLinkSchema } from "./schema";
import { requireAuth } from "../auth/middleware";

export const createLink = createServerFn({ method: "POST" })
  .inputValidator(createLinkSchema)
  .middleware([requireAuth])
  .handler(async ({ data, context }) => {
    const key = data.key || genLinkKey();

    const domain = await db.query.domains.findFirst({
      where: {
        domain: data.domain,
        OR: [{ userId: context.user.id }, { public: true }],
      },
    });
    if (!domain) {
      throw new Error(`Domain ${data.domain} not linked`);
    }

    try {
      await db.insert(links).values({
        domain: data.domain,
        key,
        url: data.url,
        userId: context.user.id,
      });
    } catch (_e) {
      throw new Error(`${data.domain}/${data.key} already exists`);
    }
  });
