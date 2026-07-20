import { prisma } from "../../lib/db";
import { Prisma } from "../../generated/prisma/client";

export const createBlog = async (data: {
  title: string;
  slug: string;
  content: string;
  banner: Record<string, string>;
  status: string;
  authorId: string;
}) => {
  const createData: Prisma.BlogCreateInput = {
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

  return prisma.blog.create({
    data: createData,
    include: {
      author: {
        select: { id: true, username: true, email: true, role: true },
      },
    },
  });
};

export const findBlogById = async (id: string) => {
  return prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true, email: true, role: true },
      },
    },
  });
};

export const findBlogBySlug = async (slug: string) => {
  return prisma.blog.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, username: true, email: true, role: true },
      },
    },
  });
};

export const findBlogs = async (params: {
  skip: number;
  take: number;
  where: Prisma.BlogWhereInput;
}) => {
  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
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
    prisma.blog.count({ where: params.where }),
  ]);

  return { blogs, total };
};

export const updateBlog = async (
  id: string,
  data: Prisma.BlogUpdateInput,
) => {
  return prisma.blog.update({
    where: { id },
    data,
    include: {
      author: {
        select: { id: true, username: true, email: true, role: true },
      },
    },
  });
};

export const deleteBlog = async (id: string) => {
  return prisma.blog.delete({ where: { id } });
};

export const incrementBlogViews = async (id: string) => {
  return prisma.blog.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  });
};

export const findUserRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? null;
};
