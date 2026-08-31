import z from "zod";

export const editLinkSchema = z
  .object({
    domain: z.string().min(1, "Required"),
    key: z
      .string()
      .trim()
      .min(1, "Required")
      .regex(
        /^[A-Za-z0-9-_/:*]+$/,
        "Only the characters A-Z, a-z, 0-9, -, _, and / are allowed",
      )
      .toLowerCase()
      .transform((key) => key.split("/").filter(Boolean).join("/"))
      .refine((key) => !key.startsWith("app"), "Cannot start with /app"),
    url: z.httpUrl("Invalid URL"),

    expiration: z
      .object({
        date: z.coerce.date<string>().or(z.literal("")),
        url: z.string().trim(),
      })
      .superRefine((val, ctx) => {
        if (
          val.date &&
          z.httpUrl("Invalid URL").safeParse(val.url).success === false
        ) {
          ctx.addIssue({
            code: "invalid_format",
            format: "url",
            message: "Invalid URL",
            path: ["url"],
          });
        }
      }),

    password: z.string().or(z.literal("")),

    isCloaked: z.boolean(),
  })
  .superRefine((val, ctx) => {
    const keyParts = val.key
      .replace(/^https?:\/\//, "")
      .split("/")
      .filter(Boolean);
    const keyParams = keyParts.filter((part) => part.startsWith(":"));
    const notKeyParams = keyParts.filter((part) => !part.startsWith(":"));

    const urlParts = val.url
      .replace(/^https?:\/\//, "")
      .split("/")
      .filter(Boolean);
    const urlParams = urlParts.filter((part) => part.startsWith(":"));

    if (notKeyParams.some((part) => part.includes(":") || part.includes("*"))) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters : and * are only allowed as parameters (e.g. :param or :param*)",
        path: ["key"],
      });
    }
    for (const part of keyParams) {
      if (!/^:[A-Za-z0-9_-]+\*?$/.test(part)) {
        ctx.addIssue({
          code: "custom",
          message: `Invalid format for parameter ${part.slice(1)}`,
          path: ["key"],
        });
      }
      if (part.endsWith("*")) {
        if (!val.key.endsWith(part)) {
          ctx.addIssue({
            code: "custom",
            message: `Parameter ${part.slice(1)} with * must be last`,
            path: ["key"],
          });
        }
      }
    }
    for (const part of urlParams) {
      if (!keyParams.includes(part)) {
        ctx.addIssue({
          code: "custom",
          message: `Parameter ${part.slice(1)} is not defined in the short URL`,
          path: ["url"],
        });
      }
    }
  });
