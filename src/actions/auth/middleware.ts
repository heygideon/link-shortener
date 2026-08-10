import { getSession } from "#/lib/session";
import { createMiddleware } from "@tanstack/react-start";

export const requireAuth = createMiddleware().server(async ({ next }) => {
  const { user } = await getSession();

  if (!user) {
    throw new Error("Not logged in");
  }

  return next({ context: { user } });
});
