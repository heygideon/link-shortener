import { createServerFn } from "@tanstack/react-start";
import { maybeAuth } from "./middleware";
import { deleteSession } from "#/lib/session";

export const getCurrentUser = createServerFn()
  .middleware([maybeAuth])
  .handler(async ({ context }) => {
    if (!context.user) return null;

    return {
      id: context.user.id,
      firstName: context.user.firstName,
      lastName: context.user.lastName,
      email: context.user.email,
      slackId: context.user.slackId,
    };
  });

export const logout = createServerFn()
  .middleware([maybeAuth])
  .handler(async () => {
    await deleteSession();
  });
