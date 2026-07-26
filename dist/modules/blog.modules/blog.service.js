"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserRole = exports.incrementBlogViews = exports.deleteBlog = exports.updateBlog = exports.findBlogs = exports.findBlogBySlug = exports.findBlogById = exports.createBlog = void 0;
const db_1 = require("../../lib/db");
const createBlog = async (data) => {
    const createData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        banner: data.banner,
        status: data.status,
        author: { connect: { id: data.authorId } },
    };
    if (data.status === "published") {
        createData.publishedAt = new Date();
    }
    return db_1.prisma.blog.create({
        data: createData,
        include: {
            author: {
                select: { id: true, username: true, email: true, role: true },
            },
        },
    });
};
exports.createBlog = createBlog;
const findBlogById = async (id) => {
    return db_1.prisma.blog.findUnique({
        where: { id },
        include: {
            author: {
                select: { id: true, username: true, email: true, role: true },
            },
        },
    });
};
exports.findBlogById = findBlogById;
const findBlogBySlug = async (slug) => {
    return db_1.prisma.blog.findUnique({
        where: { slug },
        include: {
            author: {
                select: { id: true, username: true, email: true, role: true },
            },
        },
    });
};
exports.findBlogBySlug = findBlogBySlug;
const findBlogs = async (params) => {
    const [blogs, total] = await Promise.all([
        db_1.prisma.blog.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
            orderBy: { publishedAt: "desc" },
            include: {
                author: {
                    select: { id: true, username: true, email: true },
                },
            },
        }),
        db_1.prisma.blog.count({ where: params.where }),
    ]);
    return { blogs, total };
};
exports.findBlogs = findBlogs;
const updateBlog = async (id, data) => {
    return db_1.prisma.blog.update({
        where: { id },
        data,
        include: {
            author: {
                select: { id: true, username: true, email: true, role: true },
            },
        },
    });
};
exports.updateBlog = updateBlog;
const deleteBlog = async (id) => {
    return db_1.prisma.blog.delete({ where: { id } });
};
exports.deleteBlog = deleteBlog;
const incrementBlogViews = async (id) => {
    return db_1.prisma.blog.update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
    });
};
exports.incrementBlogViews = incrementBlogViews;
const findUserRole = async (userId) => {
    const user = await db_1.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    return user?.role ?? null;
};
exports.findUserRole = findUserRole;
//# sourceMappingURL=blog.service.js.map