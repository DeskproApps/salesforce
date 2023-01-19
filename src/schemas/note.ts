import { z } from "zod";

export const noteSchema = z.object({
  Title: z.string(),
  Body: z.string(),
  ParentId: z.string().optional(),
});
