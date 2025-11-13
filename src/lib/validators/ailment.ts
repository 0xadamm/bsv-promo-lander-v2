import { z } from "zod";

export const ailmentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),

  category: z.enum(["joint", "muscle", "recovery", "general"]),

  iconUrl: z.string().url("Invalid icon URL").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").optional(),

  displayOrder: z.number().default(0),
});

export const createAilmentSchema = ailmentSchema.extend({
  slug: z.string().optional(), // Slug is optional on create, will be auto-generated from name
});

export const updateAilmentSchema = ailmentSchema.partial();

export type CreateAilmentInput = z.infer<typeof createAilmentSchema>;
export type UpdateAilmentInput = z.infer<typeof updateAilmentSchema>;
