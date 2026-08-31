import z from "zod";

export const createLinkSchema = z.object({
  domain: z.string().min(1, "Required"),
  key: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z0-9-_/]*$/,
      "Only the characters A-Z, a-z, 0-9, -, _, and / are allowed",
    )
    .transform((key) => key.split("/").filter(Boolean).join("/"))
    .refine((key) => !key.startsWith("app"), "Cannot start with /app"),
  url: z.url("Invalid URL"),
});
