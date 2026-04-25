import z from "zod";

export const createLinkSchema = z.object({
  domain: z.string().min(1, "Required"),
  key: z.string(),
  url: z.url("Invalid URL"),
});
