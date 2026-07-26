"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserRole = exports.deleteUserWithBlogs = exports.updateUser = exports.findUsers = exports.findUserById = void 0;
const db_1 = require("../../lib/db");
const findUserById = async (id) => {
    return db_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            socialLinks: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.findUserById = findUserById;
const findUsers = async (params) => {
    const [users, total] = await Promise.all([
        db_1.prisma.user.findMany({
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                socialLinks: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        db_1.prisma.user.count(),
    ]);
    return { users, total };
};
exports.findUsers = findUsers;
const updateUser = async (id, data) => {
    return db_1.prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            socialLinks: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.updateUser = updateUser;
const deleteUserBlogs = async (userId) => {
    await db_1.prisma.blog.deleteMany({ where: { authorId: userId } });
};
const deleteUserWithBlogs = async (id) => {
    await deleteUserBlogs(id);
    return db_1.prisma.user.delete({ where: { id } });
};
exports.deleteUserWithBlogs = deleteUserWithBlogs;
const findUserRole = async (userId) => {
    const user = await db_1.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    return user?.role ?? null;
};
exports.findUserRole = findUserRole;
//# sourceMappingURL=user.service.js.map