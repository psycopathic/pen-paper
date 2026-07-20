import { prisma } from "../../lib/db";

export const createComment = async (data: {
  content: string;
  blogId: string;
  userId: string;
}) => {
  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data,
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    }),
    prisma.blog.update({
      where: { id: data.blogId },
      data: { commentsCount: { increment: 1 } },
    }),
  ]);

  return comment;
};

export const findCommentById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    select: { id: true, blogId: true, userId: true },
  });
};

export const deleteComment = async (id: string) => {
  const comment = await prisma.comment.delete({
    where: { id },
  });

  await prisma.blog.update({
    where: { id: comment.blogId },
    data: { commentsCount: { decrement: 1 } },
  });

  return comment;
};

export const findCommentsByBlogId = async (blogId: string) => {
  return prisma.comment.findMany({
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

export const findComments = async (params: {
  skip: number;
  take: number;
}) => {
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
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
    prisma.comment.count(),
  ]);

  return { comments, total };
};

export const findBlogBySlug = async (slug: string) => {
  return prisma.blog.findUnique({
    where: { slug },
    select: { id: true, commentsCount: true },
  });
};

export const findBlogById = async (id: string) => {
  return prisma.blog.findUnique({
    where: { id },
    select: { id: true, commentsCount: true },
  });
};

export const findUserRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? null;
};
