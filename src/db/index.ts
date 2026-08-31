import { drizzle } from "drizzle-orm/libsql";
import { relations } from "./relations";

const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL || "file:./dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  relations,
});
export default db;
