"use server";

import prisma from "@/db/db";
import { Comment } from "@/db/schema/comments";

export const fetchComments = async (
  {
    articleId,
    parentId,
    userId,
  }: { articleId: number; parentId?: number; userId?: number } = {
    articleId: 0,
    parentId: undefined,
  }
): Promise<Comment[]> => {
  const comments = await prisma.comment.findMany({
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
      repliesCount: true,
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

  const commentIds = comments.map((comment) => comment.id);

  const interactions = await prisma.interaction.findMany({
    select: {
      userId: true,
      commentId: true,
      type: true,
    },
    where: {
      commentId: { in: commentIds },
      type: {
        in: ["LIKE", "DISLIKE"],
      },
    },
  });

  console.log(
    "interactions for these comments :::::::: ",
    interactions,
    commentIds
  );

  const likeCountMap = new Map<number, number>();
  const dislikeCountMap = new Map<number, number>();
  const likedByUserSet = new Set<number>();
  const dislikedByUserSet = new Set<number>();

  interactions.forEach(({ userId: uid, commentId: cid, type }) => {
    if (!cid) return;

    if (type === "LIKE") {
      likeCountMap.set(cid, (likeCountMap.get(cid) ?? 0) + 1);
      if (userId && uid === userId) likedByUserSet.add(cid);
    }

    if (type === "DISLIKE") {
      dislikeCountMap.set(cid, (dislikeCountMap.get(cid) ?? 0) + 1);
      if (userId && uid === userId) dislikedByUserSet.add(cid);
    }
  });

  return comments.map((com) => ({
    ...com,
    likeCount: likeCountMap.get(com.id) ?? 0,
    dislikeCount: dislikeCountMap.get(com.id) ?? 0,
    isLiked: likedByUserSet.has(com.id),
    isDisliked: dislikedByUserSet.has(com.id),
  }));
};

export const createComment = async (
  text: string,
  articleId: number,
  userId: number,
  parentId: number | undefined
): Promise<Comment> => {
  // Check if user is restricted
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isRestricted: true },
  });

  if (user?.isRestricted) {
    throw new Error(
      "You are restricted from commenting. Please contact an administrator."
    );
  }

  const newComment = await prisma.comment.create({
    data: {
      content: text,
      articleId,
      authorId: userId,
      parentId: parentId ?? null,
      likeCount: 0,
      dislikeCount: 0,
      repliesCount: 0,
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
      repliesCount: true,
      author: {
        select: {
          id: true,
          name: true,
          profilePic: true,
        },
      },
    },
  });

  if (parentId) {
    const res = await prisma.comment.update({
      data: {
        repliesCount: {
          increment: 1,
        },
      },
      where: {
        id: parentId,
      },
    });

    console.log("update res ====== ", res);
  }

  return newComment;
};
