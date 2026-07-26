import z from "zod";
export declare const createBlogSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    banner: z.ZodRecord<z.ZodString, z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
    }>>;
}, z.core.$strip>;
export declare const updateBlogSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    banner: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
    }>>>;
}, z.core.$strip>;
export declare const blogQuerySchema: z.ZodObject<{
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        published: "published";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogQuery = z.infer<typeof blogQuerySchema>;
//# sourceMappingURL=blog.schema.d.ts.map