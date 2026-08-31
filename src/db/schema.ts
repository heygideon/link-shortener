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

  isAdmin: int("is_admin", { mode: "boolean" }).notNull().default(false),

  ...timestamps,
});
export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid2()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
});

export const domains = sqliteTable("domains", {
  domain: text("domain").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  public: int("public", { mode: "boolean" }).notNull().default(false),

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

    // for dynamic links
    normalisedKey: text("normalised_key").unique(),
    pattern: text("pattern"),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    archived: int("archived", { mode: "boolean" }).notNull().default(false),

    expirationDate: int("expiration_date", { mode: "timestamp" }),
    expirationUrl: text("expiration_url"),
    password: text("password"),
    isCloaked: int("is_cloaked", { mode: "boolean" }).notNull().default(false),

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
