import { createId as cuid2 } from "@paralleldrive/cuid2";
import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { timestamps } from "./shared";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  slackId: text("slack_id").notNull(),

  ...timestamps,
});

export const domains = sqliteTable("domains", {
  domain: text("domain").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamps.createdAt,
});

export const links = sqliteTable(
  "links",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid2()),
    domain: text("domain")
      .notNull()
      .references(() => domains.domain, { onDelete: "cascade" }),
    key: text("key").notNull(),
    url: text("url").notNull(),

    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
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
