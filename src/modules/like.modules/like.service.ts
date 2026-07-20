import { prisma } from "../../lib/db";

export const findBlogById = async (id: string) => {
  return prisma.blog.findUnique({
    where: { id },
    select: { id: true, likesCount: true },
  });
};

export const findExistingLike = async (blogId: string, userId: string) => {
  return prisma.like.findFirst({
    where: { blogId, userId },
  });
};

export const likeBlog = async (blogId: string, userId: string) => {
  const [, blog] = await prisma.$transaction([
    prisma.like.create({
      data: { blogId, userId },
    }),
    prisma.blog.update({
      where: { id: blogId },
      data: { likesCount: { increment: 1 } },
      select: { likesCount: true },
    }),
  ]);

  return blog;
};

export const unlikeBlog = async (blogId: string, userId: string) => {
  const like = await prisma.like.findFirst({
    where: { blogId, userId },
  });

  if (!like) return null;

  const [, blog] = await prisma.$transaction([
    prisma.like.delete({ where: { id: like.id } }),
    prisma.blog.update({
      where: { id: blogId },
      data: { likesCount: { decrement: 1 } },
      select: { likesCount: true },
    }),
  ]);

  return blog;
};
