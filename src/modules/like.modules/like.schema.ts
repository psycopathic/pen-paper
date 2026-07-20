import z from "zod";

export const likeSchema = z.object({
  blogId: z.string().uuid(),
});

export const unlikeSchema = z.object({
  blogId: z.string().uuid(),
});

export type LikeInput = z.infer<typeof likeSchema>;
