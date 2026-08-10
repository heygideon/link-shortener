import { defineRelations } from "drizzle-orm";
import { domains, linkClicks, links, sessions, users } from "./schema";

export const relations = defineRelations(
  {
    links,
    linkClicks,
    users,
    sessions,
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

    sessions: {
      user: r.one.users({
        from: r.sessions.userId,
        to: r.users.id,
        optional: false,
      }),
    },
  }),
);
