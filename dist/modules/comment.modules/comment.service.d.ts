export declare const createComment: (data: {
    content: string;
    blogId: string;
    userId: string;
}) => Promise<{
    user: {
        email: string;
        id: string;
        username: string;
    };
} & {
    id: string;
    blogId: string;
    userId: string;
    content: string;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
}>;
export declare const findCommentById: (id: string) => Promise<{
    blogId: string;
    id: string;
    userId: string;
} | null>;
export declare const deleteComment: (id: string) => Promise<{
    id: string;
    blogId: string;
    userId: string;
    content: string;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
}>;
export declare const findCommentsByBlogId: (blogId: string) => Promise<({
    blog: {
        slug: string;
        title: string;
    };
    replies: ({
        user: {
            email: string;
            id: string;
            username: string;
        };
    } & {
        id: string;
        blogId: string;
        userId: string;
        content: string;
        likesCount: number;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
    })[];
    user: {
        email: string;
        id: string;
        username: string;
    };
} & {
    id: string;
    blogId: string;
    userId: string;
    content: string;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
})[]>;
export declare const findComments: (params: {
    skip: number;
    take: number;
}) => Promise<{
    comments: ({
        blog: {
            slug: string;
            title: string;
        };
        user: {
            email: string;
            id: string;
            username: string;
        };
    } & {
        id: string;
        blogId: string;
        userId: string;
        content: string;
        likesCount: number;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
    })[];
    total: number;
}>;
export declare const findBlogBySlug: (slug: string) => Promise<{
    commentsCount: number;
    id: string;
} | null>;
export declare const findBlogById: (id: string) => Promise<{
    commentsCount: number;
    id: string;
} | null>;
export declare const findUserRole: (userId: string) => Promise<string | null>;
//# sourceMappingURL=comment.service.d.ts.map