import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { requireAuth } from "../auth/middleware";
import db from "#/db";

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
        userId: context.user.id,
      },
    });

    if (!link) {
      throw new Error("Link not found");
    }

    return next({ context: { link } });
  });
