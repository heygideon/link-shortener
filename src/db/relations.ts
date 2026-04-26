import { defineRelations } from "drizzle-orm";
import { domains, linkClicks, links, users } from "./schema";

export const relations = defineRelations(
  {
    links,
    linkClicks,
    users,
    domains,
  },
  (r) => ({
    links: {
      linkClicks: r.many.linkClicks(),
    },
    linkClicks: {
      link: r.one.links({
        from: r.linkClicks.linkId,
        to: r.links.id,
      }),
    },
  }),
);
