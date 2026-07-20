import z from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  banner: z.record(z.string(), z.string()),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(["draft", "published"]).optional(),
  search: z.string().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogQuery = z.infer<typeof blogQuerySchema>;
