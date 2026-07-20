import { prisma } from "../../lib/db";
import { Prisma } from "../../generated/prisma/client";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
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

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
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

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  role?: string;
  firstName?: string | null;
  lastName?: string | null;
  socialLinks?: Record<string, string> | null;
}) => {
  return prisma.user.create({
    data: {
      ...data,
      socialLinks: data.socialLinks ?? Prisma.JsonNull,
    },
  });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};

export const saveRefreshToken = async (userId: string, token: string) => {
  return prisma.token.create({
    data: { token, userId },
  });
};

export const findRefreshToken = async (token: string) => {
  return prisma.token.findFirst({ where: { token } });
};

export const deleteRefreshToken = async (token: string) => {
  return prisma.token.deleteMany({ where: { token } });
};

export const findUserRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? null;
};
