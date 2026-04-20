import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import db from "#/db";
import { linkClicks } from "#/db/schema";

export const getLinks = createServerFn().handler(async () => {
  const links = await db.query.links.findMany({
    columns: {
      id: true,
      domain: true,
      key: true,
      url: true,
      archived: true,
      createdAt: true,
    },
    extras: {
      clicks: (table) => db.$count(linkClicks, eq(linkClicks.linkId, table.id)),
    },
  });
  return links;
});
