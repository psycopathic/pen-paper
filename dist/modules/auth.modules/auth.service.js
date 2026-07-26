"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserRole = exports.deleteRefreshToken = exports.findRefreshToken = exports.saveRefreshToken = exports.deleteUser = exports.updateUser = exports.createUser = exports.findUserById = exports.findUserByUsername = exports.findUserByEmail = void 0;
const db_1 = require("../../lib/db");
const client_1 = require("../../generated/prisma/client");
const findUserByEmail = async (email) => {
    return db_1.prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            username: true,
            email: true,
            password: true,
            role: true,
            firstName: true,
            lastName: true,
            socialLinks: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.findUserByEmail = findUserByEmail;
const findUserByUsername = async (username) => {
    return db_1.prisma.user.findUnique({ where: { username } });
};
exports.findUserByUsername = findUserByUsername;
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
const createUser = async (data) => {
    return db_1.prisma.user.create({
        data: {
            ...data,
            socialLinks: data.socialLinks ?? client_1.Prisma.JsonNull,
        },
    });
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    return db_1.prisma.user.update({
        where: { id },
        data,
    });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return db_1.prisma.user.delete({ where: { id } });
};
exports.deleteUser = deleteUser;
const saveRefreshToken = async (userId, token) => {
    return db_1.prisma.token.create({
        data: { token, userId },
    });
};
exports.saveRefreshToken = saveRefreshToken;
const findRefreshToken = async (token) => {
    return db_1.prisma.token.findFirst({ where: { token } });
};
exports.findRefreshToken = findRefreshToken;
const deleteRefreshToken = async (token) => {
    return db_1.prisma.token.deleteMany({ where: { token } });
};
exports.deleteRefreshToken = deleteRefreshToken;
const findUserRole = async (userId) => {
    const user = await db_1.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    return user?.role ?? null;
};
exports.findUserRole = findUserRole;
//# sourceMappingURL=auth.service.js.map