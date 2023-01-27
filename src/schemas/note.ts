import { z } from "zod";

export const noteSchema = z.object({
  Title: z.string().min(1),
  Body: z.string().min(1),
  ParentId: z.string().optional(),
});
