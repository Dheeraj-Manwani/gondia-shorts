"use server";

import prisma from "@/db/db";
import { getExistingInteractions } from ".";

const applyInteractionEffect = async (
  userId: number,
  commentId: number,
  apply: boolean,
  interactionType: "LIKE" | "DISLIKE"
): Promise<boolean> => {
  const countField = interactionType === "LIKE" ? "likeCount" : "dislikeCount";
  let didChange = false;

  console.log(
    "Applying interaction effect for ===== {userId,commentId,apply, interactionType, }",
    {
      userId,
      commentId,
      apply,
      interactionType,
    }
  );

  console.log("inserting & apply ====== ", apply, interactionType);
  // await prisma.$transaction(async (prisma) => {
  if (apply) {
    await prisma.interaction.upsert({
      where: {
        userId_commentId_type: {
          userId,
          commentId,
          type: interactionType,
        },
      },
      update: {},
      create: { userId, commentId, type: interactionType },
    });

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        [countField]: { increment: 1 },
      },
    });

    didChange = true;
  } else {
    const deleted = await prisma.interaction.deleteMany({
      where: { userId, commentId, type: interactionType },
    });

    if (deleted.count > 0) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          [countField]: { decrement: 1 },
        },
      });
      didChange = true;
    }
  }
  // });

  return didChange;
};

export const handleInteraction = async (
  articleId: number,
  userId: number,
  commentId: number,
  type: "LIKE" | "DISLIKE",
  applyInteraction: boolean
): Promise<boolean> => {
  try {
    const otherType = type === "LIKE" ? "DISLIKE" : "LIKE";
    console.log("type is ", type, "another type is ", otherType);

    if (applyInteraction) {
      const existing = await getExistingInteractions(
        userId,
        undefined,
        commentId,
        ["LIKE", "DISLIKE"]
      );
      console.log(
        "existing interactions for this comment and user and article",
        existing
      );
      const hasCurrent = existing.some((i) => i.type === type);
      const hasOther = existing.some((i) => i.type === otherType);

      console.log("hasCurrent == ", hasCurrent, "has Other ==== ", hasOther);

      if (hasOther) {
        await applyInteractionEffect(userId, commentId, false, otherType);
      }

      if (!hasCurrent) {
        await applyInteractionEffect(userId, commentId, true, type);
        return true;
      }

      return false;
    }

    // Remove current interaction
    return await applyInteractionEffect(userId, commentId, false, type);
  } catch (e) {
    console.error("handleInteraction error: ", e);
    return false;
  }
};
