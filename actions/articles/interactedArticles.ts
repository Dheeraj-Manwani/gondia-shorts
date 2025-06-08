import prisma from "@/db/db";
import { InteractionType } from "@/db/schema/interaction";

export const getInteractedArticles = async (
  articleId: number,
  userId: number,
  interaction: InteractionType
) => {
  const res = await prisma.interaction.findMany({
    select: {
      article: true,
    },
    where: {
      userId: userId,
      articleId: articleId,
      commentId: null,
      type: interaction,
    },
  });

  return res;
};
