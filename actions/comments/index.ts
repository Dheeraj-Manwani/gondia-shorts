"use server";

import prisma from "@/db/db";
import { Comment } from "@/db/schema/comments";

export const fetchComments = async (
  {
    articleId,
    parentId,
  }: { articleId: number; parentId: number | undefined } = {
    articleId: 0,
    parentId: undefined,
  }
): Promise<Comment[]> => {
  return await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      articleId: true,
      authorId: true,
      parentId: true,
      likeCount: true,
      dislikeCount: true,
      author: {
        select: {
          id: true,
          name: true,
          profilePic: true,
        },
      },
    },
    where: {
      articleId,
      parentId: parentId ?? null,
    },
  });
};

export const createComment = async (
  text: string,
  articleId: number,
  userId: number,
  parentId: number | undefined
): Promise<Comment> => {
  const newComment = await prisma.comment.create({
    data: {
      content: text,
      articleId,
      authorId: userId,
      parentId: parentId ?? null,
      likeCount: 0,
      dislikeCount: 0,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      articleId: true,
      authorId: true,
      parentId: true,
      likeCount: true,
      dislikeCount: true,
      author: {
        select: {
          id: true,
          name: true,
          profilePic: true,
        },
      },
    },
  });

  return newComment;
};
