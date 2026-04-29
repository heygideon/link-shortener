import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import db from "#/db";
import { links } from "#/db/schema";
import { requireAuth } from "../auth/middleware";

export const getDomains = createServerFn()
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const domains = await db.query.domains.findMany({
      columns: {
        domain: true,
        createdAt: true,
      },
      extras: {
        links: (table) => db.$count(links, eq(links.domain, table.domain)),
      },
      where: {
        userId: context.user.id,
      },
    });
    return domains;
  });
