"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserRole = exports.findBlogById = exports.findBlogBySlug = exports.findComments = exports.findCommentsByBlogId = exports.deleteComment = exports.findCommentById = exports.createComment = void 0;
const db_1 = require("../../lib/db");
const createComment = async (data) => {
    const [comment] = await db_1.prisma.$transaction([
        db_1.prisma.comment.create({
            data,
            include: {
                user: {
                    select: { id: true, username: true, email: true },
                },
            },
        }),
        db_1.prisma.blog.update({
            where: { id: data.blogId },
            data: { commentsCount: { increment: 1 } },
        }),
    ]);
    return comment;
};
exports.createComment = createComment;
const findCommentById = async (id) => {
    return db_1.prisma.comment.findUnique({
        where: { id },
        select: { id: true, blogId: true, userId: true },
    });
};
exports.findCommentById = findCommentById;
const deleteComment = async (id) => {
    const comment = await db_1.prisma.comment.delete({
        where: { id },
    });
    await db_1.prisma.blog.update({
        where: { id: comment.blogId },
        data: { commentsCount: { decrement: 1 } },
    });
    return comment;
};
exports.deleteComment = deleteComment;
const findCommentsByBlogId = async (blogId) => {
    return db_1.prisma.comment.findMany({
        where: { blogId, parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, username: true, email: true },
            },
            blog: {
                select: { title: true, slug: true },
            },
            replies: {
                include: {
                    user: {
                        select: { id: true, username: true, email: true },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });
};
exports.findCommentsByBlogId = findCommentsByBlogId;
const findComments = async (params) => {
    const [comments, total] = await Promise.all([
        db_1.prisma.comment.findMany({
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, username: true, email: true },
                },
                blog: {
                    select: { title: true, slug: true },
                },
            },
        }),
        db_1.prisma.comment.count(),
    ]);
    return { comments, total };
};
exports.findComments = findComments;
const findBlogBySlug = async (slug) => {
    return db_1.prisma.blog.findUnique({
        where: { slug },
        select: { id: true, commentsCount: true },
    });
};
exports.findBlogBySlug = findBlogBySlug;
const findBlogById = async (id) => {
    return db_1.prisma.blog.findUnique({
        where: { id },
        select: { id: true, commentsCount: true },
    });
};
exports.findBlogById = findBlogById;
const findUserRole = async (userId) => {
    const user = await db_1.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    return user?.role ?? null;
};
exports.findUserRole = findUserRole;
//# sourceMappingURL=comment.service.js.map