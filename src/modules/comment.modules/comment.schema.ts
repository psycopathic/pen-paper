import z from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "Content is required").max(2000),
});

export const commentQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CommentQuery = z.infer<typeof commentQuerySchema>;
