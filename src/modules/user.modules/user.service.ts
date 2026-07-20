import { prisma } from "../../lib/db";
import { Prisma } from "../../generated/prisma/client";

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

export const findUsers = async (params: {
  skip: number;
  take: number;
}) => {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
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
    prisma.user.count(),
  ]);

  return { users, total };
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({
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

const deleteUserBlogs = async (userId: string) => {
  await prisma.blog.deleteMany({ where: { authorId: userId } });
};

export const deleteUserWithBlogs = async (id: string) => {
  await deleteUserBlogs(id);
  return prisma.user.delete({ where: { id } });
};

export const findUserRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? null;
};
