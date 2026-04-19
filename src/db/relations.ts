import { defineRelations } from "drizzle-orm";
import { linkClicks, links } from "./schema";

export const relations = defineRelations(
	{
		links,
		linkClicks,
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
