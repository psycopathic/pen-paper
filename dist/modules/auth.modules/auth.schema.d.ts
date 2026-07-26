import z from "zod";
export declare const createUserSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodString>;
    firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    socialLinks: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    firstName: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    lastName: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    socialLinks: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>>;
}, z.core.$strip>;
export declare const userSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodString>;
    firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    socialLinks: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;
//# sourceMappingURL=auth.schema.d.ts.map