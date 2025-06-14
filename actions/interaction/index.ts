import prisma from "@/db/db";
import { InteractionType } from "@/db/schema/interaction";

export const getExistingInteractions = async (
  userId: number,
  articleId?: number,
  commentId?: number,
  types?: InteractionType[]
): Promise<{ id: number; type: string }[]> => {
  const res = await prisma.interaction.findMany({
    select: {
      id: true,
      type: true,
    },
    where: {
      userId,
      ...(articleId ? { articleId } : {}),
      ...(commentId ? { commentId } : {}),
      ...(types ? { type: { in: types } } : {}),
    },
  });

  return res;
};

export const deleteInteractions = async (
  userId: number,
  articleId?: number,
  commentId?: number,
  types?: InteractionType[]
): Promise<number> => {
  const res = await prisma.interaction.deleteMany({
    where: {
      userId,
      ...(articleId ? { articleId } : {}),
      ...(commentId ? { commentId } : {}),
      ...(types ? { type: { in: types } } : {}),
    },
  });

  return res.count;
};
