import { sql } from "drizzle-orm";
import { int } from "drizzle-orm/sqlite-core";

export const timestamps = {
	createdAt: int("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdateFn(
		() => sql`(unixepoch())`,
	),
};
