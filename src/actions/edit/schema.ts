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
  url: z.url("Invalid URL"),

  expiration: z
    .object({
      date: z.coerce.date<string>().or(z.literal("")),
      url: z.url("Invalid URL").or(z.literal("")),
    })
    .superRefine((val, ctx) => {
      if (val.url && !val.date) {
        ctx.addIssue({
          code: "custom",
          message: "Expiration date is required if expiration URL is set",
          path: ["date"],
        });
      }
    }),

  password: z.string().or(z.literal("")),

  isCloaked: z.boolean(),
});
