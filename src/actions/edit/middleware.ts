import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import db from "#/db";
import { requireAuth } from "../auth/middleware";

export const withLink = createMiddleware({ type: "function" })
  .middleware([requireAuth])
  .inputValidator(
    z.looseObject({
      id: z.string(),
    }),
  )
  .server(async ({ context, data, next }) => {
    const link = await db.query.links.findFirst({
      where: {
        id: data.id,
        userId: context.user.isAdmin ? undefined : context.user.id,
      },
    });

    if (!link) {
      throw new Error("Link not found");
    }

    return next({ context: { link } });
  });
