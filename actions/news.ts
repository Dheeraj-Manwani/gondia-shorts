"use server";

import prisma from "@/db/db";

export const fetchArticles = async () => {
  const articles = await prisma.article.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return { success: true, data: articles };
};
