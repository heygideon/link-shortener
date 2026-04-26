import db from "#/db";
import { useAppSession } from "#/lib/session";
import { createMiddleware } from "@tanstack/react-start";

export const requireAuth = createMiddleware().server(async ({ next }) => {
  const session = await useAppSession();
  const user = await db.query.users.findFirst({
    where: { id: session.data.userId || "" },
  });

  if (!user) {
    throw new Error("Not logged in");
  }

  return next({ context: { user } });
});
