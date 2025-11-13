import { z } from "zod";

export const sportSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),

  iconUrl: z.string().url("Invalid icon URL").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").optional(),

  displayOrder: z.number().default(0),
});

export const createSportSchema = sportSchema.extend({
  slug: z.string().optional(), // Slug is optional on create, will be auto-generated from name
});

export const updateSportSchema = sportSchema.partial();

export type CreateSportInput = z.infer<typeof createSportSchema>;
export type UpdateSportInput = z.infer<typeof updateSportSchema>;
