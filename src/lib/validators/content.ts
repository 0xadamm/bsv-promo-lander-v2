import { z } from "zod";

export const contentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),

  contentType: z.enum(["testimonial", "raw-footage", "content"], {
    required_error: "Content type is required",
  }),

  mediaType: z.enum(["image", "video"], {
    required_error: "Media type is required",
  }),
  mediaUrls: z.array(z.string().url("Invalid media URL")).min(1, "At least one media URL is required"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),

  sports: z.array(z.string()).default([]),
  ailments: z.array(z.string()).default([]),

  athleteName: z.string().optional(),
  source: z.string().optional(),

  featured: z.boolean().default(false),
  priority: z.number().default(0),
  publishedAt: z.date().default(() => new Date()),
});

export const createContentSchema = contentSchema.extend({
  slug: z.string().optional(), // Slug is optional on create, will be auto-generated from title
});

export const updateContentSchema = contentSchema.partial();

export type CreateContentInput = z.infer<typeof createContentSchema>;
export type UpdateContentInput = z.infer<typeof updateContentSchema>;
