import { z } from "zod";

export const boardConfigSchema = z.object({
  slideDuration: z.number().min(3, "Min 3s").max(120, "Max 120s"),
  youtubeUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export type BoardConfig = z.infer<typeof boardConfigSchema>;
