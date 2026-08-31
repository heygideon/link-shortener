import z from "zod";

export const editLinkSchema = z.object({
  domain: z.string().min(1, "Required"),
  key: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(
      /^[A-Za-z0-9-_/]+$/,
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
});
