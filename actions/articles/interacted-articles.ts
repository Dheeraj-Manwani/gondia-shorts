import prisma from "@/db/db";
import { Article } from "@/db/schema/article";
import { InteractionType } from "@/db/schema/interaction";

export const getInteractedArticles = async (
  userId: number,
  interactionType: InteractionType
): Promise<Article[]> => {
  const res = await prisma.interaction.findMany({
    select: {
      article: true,
    },
    where: {
      userId: userId,
      commentId: null,
      type: interactionType,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const articles = res.map((art) => art.article).filter((art) => art != null);

  return articles;
};
