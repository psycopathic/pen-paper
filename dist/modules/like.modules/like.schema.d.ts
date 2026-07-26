import z from "zod";
export declare const likeSchema: z.ZodObject<{
    blogId: z.ZodString;
}, z.core.$strip>;
export declare const unlikeSchema: z.ZodObject<{
    blogId: z.ZodString;
}, z.core.$strip>;
export type LikeInput = z.infer<typeof likeSchema>;
//# sourceMappingURL=like.schema.d.ts.map