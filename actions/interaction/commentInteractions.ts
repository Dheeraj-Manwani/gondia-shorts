"use server";

import prisma from "@/db/db";
import { deleteInteractions, getExistingInteractions } from ".";

const performCommentDislike = async (
  userId: number,
  commentId: number,
  isPositive: boolean
) => {
  const trx = await prisma.$transaction([
    isPositive
      ? prisma.interaction.upsert({
          where: {
            userId_commentId_type: {
              userId,
              commentId,
              type: "DISLIKE",
            },
          },
          update: {},
          create: {
            userId,
            commentId,
            type: "DISLIKE",
          },
        })
      : prisma.interaction.deleteMany({
          where: {
            userId,
            commentId,
            type: "DISLIKE",
          },
        }),
    prisma.comment.update({
      where: { id: commentId },
      data: {
        dislikeCount: {
          increment: 1,
        },
      },
    }),
  ]);
};

export const likeComment = async (
  articleId: number,
  userId: number,
  commentId: number,
  shouldLike: boolean
): Promise<boolean> => {
  try {
    if (shouldLike) {
      const existing = await prisma.interaction.findFirst({
        where: {
          userId,
          articleId,
          commentId,
          type: "LIKE",
        },
      });

      if (!existing) {
        const trx = await prisma.$transaction([
          prisma.interaction.upsert({
            where: {
              userId_commentId_type: {
                userId,
                commentId,
                type: "LIKE",
              },
            },
            update: {},
            create: {
              userId,
              commentId,
              type: "LIKE",
            },
          }),
          prisma.comment.update({
            where: { id: commentId },
            data: {
              likeCount: {
                increment: 1,
              },
            },
          }),
        ]);
        return true;
      }
      return false;
    } else {
      // Remove user from set (returns 1 if user was in set)

      const { count } = await prisma.interaction.deleteMany({
        where: {
          userId,
          articleId,
          type: "LIKE",
        },
      });

      if (count > 0) {
        await prisma.article.update({
          where: { id: articleId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};

export const dislikeComment = async (
  articleId: number,
  userId: number,
  commentId: number,
  shouldDislike: boolean
): Promise<boolean> => {
  try {
    if (shouldDislike) {
      const existing = await getExistingInteractions(
        userId,
        articleId,
        commentId,
        ["LIKE", "DISLIKE"]
      );

      const isLikedExists = existing.some(
        (interaction) => interaction.type === "LIKE"
      );
      const isDislikedExists = existing.some(
        (interaction) => interaction.type === "DISLIKE"
      );

      if (isLikedExists) {
        await deleteInteractions(userId, articleId, commentId, ["LIKE"]);
      }

      if (!isDislikedExists) {
        const trx = await prisma.$transaction([
          prisma.interaction.upsert({
            where: {
              userId_commentId_type: {
                userId,
                commentId,
                type: "DISLIKE",
              },
            },
            update: {},
            create: {
              userId,
              commentId,
              type: "DISLIKE",
            },
          }),
          prisma.comment.update({
            where: { id: commentId },
            data: {
              dislikeCount: {
                increment: 1,
              },
            },
          }),
        ]);
        return true;
      }
      return false;
    } else {
      // Remove user from set (returns 1 if user was in set)

      const { count } = await prisma.interaction.deleteMany({
        where: {
          userId,
          articleId,
          type: "LIKE",
        },
      });

      if (count > 0) {
        await prisma.article.update({
          where: { id: articleId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};
