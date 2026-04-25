import { createServerFn } from "@tanstack/react-start";
import db from "#/db";
import { links } from "#/db/schema";
import { genLinkKey } from "#/lib/link";
import { createLinkSchema } from "./schema";

export const createLink = createServerFn({ method: "POST" })
  .inputValidator(createLinkSchema)
  .handler(async ({ data }) => {
    const key = data.key || genLinkKey();

    // TODO: check user has access to domain
    try {
      await db.insert(links).values({
        domain: data.domain,
        key,
        url: data.url,
      });
    } catch (_e) {
      throw new Error(`${data.domain}/${data.key} already exists`);
    }
  });
