"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeBlog = exports.likeBlog = exports.findExistingLike = exports.findBlogById = void 0;
const db_1 = require("../../lib/db");
const findBlogById = async (id) => {
    return db_1.prisma.blog.findUnique({
        where: { id },
        select: { id: true, likesCount: true },
    });
};
exports.findBlogById = findBlogById;
const findExistingLike = async (blogId, userId) => {
    return db_1.prisma.like.findFirst({
        where: { blogId, userId },
    });
};
exports.findExistingLike = findExistingLike;
const likeBlog = async (blogId, userId) => {
    const [, blog] = await db_1.prisma.$transaction([
        db_1.prisma.like.create({
            data: { blogId, userId },
        }),
        db_1.prisma.blog.update({
            where: { id: blogId },
            data: { likesCount: { increment: 1 } },
            select: { likesCount: true },
        }),
    ]);
    return blog;
};
exports.likeBlog = likeBlog;
const unlikeBlog = async (blogId, userId) => {
    const like = await db_1.prisma.like.findFirst({
        where: { blogId, userId },
    });
    if (!like)
        return null;
    const [, blog] = await db_1.prisma.$transaction([
        db_1.prisma.like.delete({ where: { id: like.id } }),
        db_1.prisma.blog.update({
            where: { id: blogId },
            data: { likesCount: { decrement: 1 } },
            select: { likesCount: true },
        }),
    ]);
    return blog;
};
exports.unlikeBlog = unlikeBlog;
//# sourceMappingURL=like.service.js.map