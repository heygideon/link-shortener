import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
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
        public: true,
      },
      extras: {
        links: (table) =>
          db.$count(
            links,
            and(
              eq(links.domain, table.domain),
              context.user.isAdmin
                ? undefined
                : eq(links.userId, context.user.id),
            ),
          ),
      },
      where: {
        OR: context.user.isAdmin
          ? undefined
          : [{ userId: context.user.id }, { public: true }],
      },
    });
    return domains;
  });
