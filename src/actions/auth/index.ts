import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./middleware";

export const getUser = createServerFn()
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    return {
      id: context.user.id,
      firstName: context.user.firstName,
      lastName: context.user.lastName,
      email: context.user.email,
      slackId: context.user.slackId,
    };
  });
