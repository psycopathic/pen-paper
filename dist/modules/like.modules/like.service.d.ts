export declare const findBlogById: (id: string) => Promise<{
    id: string;
    likesCount: number;
} | null>;
export declare const findExistingLike: (blogId: string, userId: string) => Promise<{
    id: string;
    blogId: string | null;
    commentId: string | null;
    userId: string;
} | null>;
export declare const likeBlog: (blogId: string, userId: string) => Promise<{
    likesCount: number;
}>;
export declare const unlikeBlog: (blogId: string, userId: string) => Promise<{
    likesCount: number;
} | null>;
//# sourceMappingURL=like.service.d.ts.map