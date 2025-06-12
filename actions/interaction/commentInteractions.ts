"use server";

import prisma from "@/db/db";
import { deleteInteractions, getExistingInteractions } from ".";

const performCommentInteraction = async (
  userId: number,
  commentId: number,
  isPositive: boolean,
  interactionType: "LIKE" | "DISLIKE"
): Promise<boolean> => {
  const countField = interactionType === "LIKE" ? "likeCount" : "dislikeCount";
  let interactionActuallyPerformed = false;

  await prisma.$transaction(async (prisma) => {
    if (isPositive) {
      interactionActuallyPerformed = true;

      await prisma.interaction.upsert({
        where: {
          userId_commentId_type: {
            userId,
            commentId,
            type: interactionType,
          },
        },
        update: {},
        create: {
          userId,
          commentId,
          type: interactionType,
        },
      });

      await prisma.comment.update({
        where: { id: commentId },
        data: {
          [countField]: {
            increment: 1,
          },
        },
      });
    } else {
      const deleted = await prisma.interaction.deleteMany({
        where: {
          userId,
          commentId,
          type: interactionType,
        },
      });

      if (deleted.count > 0) {
        interactionActuallyPerformed = true;

        await prisma.comment.update({
          where: { id: commentId },
          data: {
            [countField]: {
              decrement: 1,
            },
          },
        });
      }
    }
  });

  return interactionActuallyPerformed;
};

export const handleInteraction = async (
  articleId: number,
  userId: number,
  commentId: number,
  type: "LIKE" | "DISLIKE",
  isPositive: boolean
): Promise<boolean> => {
  try {
    const currentType = type;
    const otherType = currentType == "LIKE" ? "DISLIKE" : "LIKE";
    if (isPositive) {
      const existing = await getExistingInteractions(
        userId,
        articleId,
        commentId,
        ["LIKE", "DISLIKE"]
      );

      const isCurrentExists = existing.some(
        (interaction) => interaction.type === currentType
      );
      const isOtherExists = existing.some(
        (interaction) => interaction.type === otherType
      );

      if (isOtherExists) {
        await performCommentInteraction(userId, commentId, false, otherType);
      }

      if (!isCurrentExists) {
        await performCommentInteraction(userId, commentId, true, currentType);

        return true;
      }
      return false;
    } else {
      return await performCommentInteraction(
        userId,
        commentId,
        false,
        currentType
      );
    }
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};
