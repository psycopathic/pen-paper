import { Prisma } from "../../generated/prisma/client";
export declare const findUserById: (id: string) => Promise<{
    createdAt: Date;
    email: string;
    firstName: string | null;
    id: string;
    lastName: string | null;
    role: string;
    socialLinks: import("@prisma/client/runtime/client").JsonValue;
    updatedAt: Date;
    username: string;
} | null>;
export declare const findUsers: (params: {
    skip: number;
    take: number;
}) => Promise<{
    users: {
        createdAt: Date;
        email: string;
        firstName: string | null;
        id: string;
        lastName: string | null;
        role: string;
        socialLinks: import("@prisma/client/runtime/client").JsonValue;
        updatedAt: Date;
        username: string;
    }[];
    total: number;
}>;
export declare const updateUser: (id: string, data: Prisma.UserUpdateInput) => Promise<{
    createdAt: Date;
    email: string;
    firstName: string | null;
    id: string;
    lastName: string | null;
    role: string;
    socialLinks: import("@prisma/client/runtime/client").JsonValue;
    updatedAt: Date;
    username: string;
}>;
export declare const deleteUserWithBlogs: (id: string) => Promise<{
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const findUserRole: (userId: string) => Promise<string | null>;
//# sourceMappingURL=user.service.d.ts.map