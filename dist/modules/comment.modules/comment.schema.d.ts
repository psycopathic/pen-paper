import z from "zod";
export declare const createCommentSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export declare const commentQuerySchema: z.ZodObject<{
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CommentQuery = z.infer<typeof commentQuerySchema>;
//# sourceMappingURL=comment.schema.d.ts.map