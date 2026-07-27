import { Prisma } from "@prisma/client";
export declare const findUserByEmail: (email: string) => Promise<{
    createdAt: Date;
    email: string;
    firstName: string | null;
    id: string;
    lastName: string | null;
    password: string;
    role: string;
    socialLinks: Prisma.JsonValue;
    updatedAt: Date;
    username: string;
} | null>;
export declare const findUserByUsername: (username: string) => Promise<{
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    socialLinks: Prisma.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const findUserById: (id: string) => Promise<{
    createdAt: Date;
    email: string;
    firstName: string | null;
    id: string;
    lastName: string | null;
    role: string;
    socialLinks: Prisma.JsonValue;
    updatedAt: Date;
    username: string;
} | null>;
export declare const createUser: (data: {
    username: string;
    email: string;
    password: string;
    role?: string;
    firstName?: string | null;
    lastName?: string | null;
    socialLinks?: Record<string, string> | null;
}) => Promise<{
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    socialLinks: Prisma.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateUser: (id: string, data: Prisma.UserUpdateInput) => Promise<{
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    socialLinks: Prisma.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteUser: (id: string) => Promise<{
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    socialLinks: Prisma.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const saveRefreshToken: (userId: string, token: string) => Promise<{
    id: string;
    token: string;
    userId: string;
}>;
export declare const findRefreshToken: (token: string) => Promise<{
    id: string;
    token: string;
    userId: string;
} | null>;
export declare const deleteRefreshToken: (token: string) => Promise<Prisma.BatchPayload>;
export declare const findUserRole: (userId: string) => Promise<string | null>;
//# sourceMappingURL=auth.service.d.ts.map