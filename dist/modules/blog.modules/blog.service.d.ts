import { Prisma } from "@prisma/client";
export declare const createBlog: (data: {
    title: string;
    slug: string;
    content: string;
    banner: Record<string, string>;
    status: string;
    authorId: string;
}) => Promise<{
    author: {
        email: string;
        id: string;
        role: string;
        username: string;
    };
} & {
    id: string;
    title: string;
    slug: string;
    content: string;
    banner: Prisma.JsonValue;
    authorId: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: string;
    publishedAt: Date;
    updatedAt: Date;
}>;
export declare const findBlogById: (id: string) => Promise<({
    author: {
        email: string;
        id: string;
        role: string;
        username: string;
    };
} & {
    id: string;
    title: string;
    slug: string;
    content: string;
    banner: Prisma.JsonValue;
    authorId: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: string;
    publishedAt: Date;
    updatedAt: Date;
}) | null>;
export declare const findBlogBySlug: (slug: string) => Promise<({
    author: {
        email: string;
        id: string;
        role: string;
        username: string;
    };
} & {
    id: string;
    title: string;
    slug: string;
    content: string;
    banner: Prisma.JsonValue;
    authorId: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: string;
    publishedAt: Date;
    updatedAt: Date;
}) | null>;
export declare const findBlogs: (params: {
    skip: number;
    take: number;
    where: Prisma.BlogWhereInput;
}) => Promise<{
    blogs: ({
        author: {
            email: string;
            id: string;
            username: string;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        content: string;
        banner: Prisma.JsonValue;
        authorId: string;
        viewsCount: number;
        likesCount: number;
        commentsCount: number;
        status: string;
        publishedAt: Date;
        updatedAt: Date;
    })[];
    total: number;
}>;
export declare const updateBlog: (id: string, data: Prisma.BlogUpdateInput) => Promise<{
    author: {
        email: string;
        id: string;
        role: string;
        username: string;
    };
} & {
    id: string;
    title: string;
    slug: string;
    content: string;
    banner: Prisma.JsonValue;
    authorId: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: string;
    publishedAt: Date;
    updatedAt: Date;
}>;
export declare const deleteBlog: (id: string) => Promise<{
    id: string;
    title: string;
    slug: string;
    content: string;
    banner: Prisma.JsonValue;
    authorId: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: string;
    publishedAt: Date;
    updatedAt: Date;
}>;
export declare const incrementBlogViews: (id: string) => Promise<{
    id: string;
    title: string;
    slug: string;
    content: string;
    banner: Prisma.JsonValue;
    authorId: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: string;
    publishedAt: Date;
    updatedAt: Date;
}>;
export declare const findUserRole: (userId: string) => Promise<string | null>;
//# sourceMappingURL=blog.service.d.ts.map