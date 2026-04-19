import { createId as cuid2 } from "@paralleldrive/cuid2";
import {
	index,
	int,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { timestamps } from "./shared";

export const links = sqliteTable(
	"links",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => cuid2()),
		domain: text("domain").notNull(),
		key: text("key").notNull(),
		url: text("url").notNull(),

		archived: int("archived", { mode: "boolean" }).notNull().default(false),

		...timestamps,
	},
	(table) => [uniqueIndex("domain_key_idx").on(table.domain, table.key)],
);

export const linkClicks = sqliteTable(
	"link_clicks",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => cuid2()),
		linkId: text("link_id")
			.notNull()
			.references(() => links.id, { onDelete: "cascade" }),

		createdAt: timestamps.createdAt,
	},
	(table) => [index("link_id_idx").on(table.linkId)],
);
