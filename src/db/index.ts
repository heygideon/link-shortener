import { drizzle } from "drizzle-orm/libsql";
import { relations } from "./relations";

const db = drizzle(process.env.DATABASE_URL || "file:./dev.db", { relations });
export default db;
