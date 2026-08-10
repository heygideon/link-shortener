import { getSession } from "#/lib/session";
import { createMiddleware } from "@tanstack/react-start";

export const maybeAuth = createMiddleware().server(async ({ next }) => {
  const { session, user } = await getSession();

  return next({ context: { session, user } });
});

export const requireAuth = createMiddleware().server(async ({ next }) => {
  const { session, user } = await getSession();
  if (!user) {
    throw new Error("Not logged in");
  }

  return next({ context: { session, user } });
});
