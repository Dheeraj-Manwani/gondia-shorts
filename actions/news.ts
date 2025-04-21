"use server";

import prisma from "@/db/db";
import { seed } from "./data";

interface FetchParams {
  categoryId?: number; // optional now
  limit: number;
  offset: number;
}

export const fetchArticles = async (fetchParams: FetchParams) => {
  const { categoryId, limit, offset } = fetchParams;
  const articles = await prisma.article.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: {
      id: "asc",
    },
    take: limit,
    skip: offset,
  });

  return { success: true, data: articles };
};
