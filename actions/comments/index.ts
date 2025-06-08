"use server";

import prisma from "@/db/db";
import { Comment } from "@/db/schema/comments";

export const fetchComments = async (
  {
    articleId,
    parentId,
    userId,
  }: { articleId: number; parentId: number | undefined; userId?: number } = {
    articleId: 0,
    parentId: undefined,
  }
): Promise<Comment[]> => {
  const comments: Comment[] = await prisma.comment.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const commentIds = comments.map((comment) => comment.id ?? -1);

  const interactions = await prisma.interaction.findMany({
    select: {
      id: true,
      type: true,
      userId: true,
      commentId: true,
    },
    where: {
      commentId: {
        in: commentIds,
      },
      type: "LIKE",
    },
  });

  comments.forEach((com) => {
    com.likeCount = interactions.filter(
      (interaction) => interaction.commentId === com.id
    ).length;
    com.isLiked =
      interactions.some(
        (interaction) =>
          interaction.userId === userId && interaction.commentId === com.id
      ) ?? false;
  });

  return comments;
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
