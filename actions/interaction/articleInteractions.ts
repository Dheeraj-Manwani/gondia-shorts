"use server";

import { Article } from "@/db/schema/article";
import { redis } from "@/lib/redis";
import chalk from "chalk";

export const updateCountsFromRedis = async (
  articles: Article[],
  userId: number
): Promise<Article[]> => {
  const pipeline = redis.pipeline();

  // Queue SCARD and SISMEMBER commands for each article
  articles.forEach((article) => {
    pipeline.scard(`article:${article.id}:likes`);
    pipeline.scard(`article:${article.id}:saves`);
    pipeline.sismember(`article:${article.id}:likes`, userId);
    pipeline.sismember(`article:${article.id}:saves`, userId);
  });

  const results = await pipeline.exec();

  return articles.map((article, idx) => {
    const likeCountResult = results?.[idx * 4];
    const saveCountResult = results?.[idx * 4 + 1];
    const meLikedResult = results?.[idx * 4 + 2];
    const meSavedResult = results?.[idx * 4 + 3];

    const likeCount =
      (likeCountResult?.[1] as number | null) ?? article.likeCount;
    const saveCount =
      (saveCountResult?.[1] as number | null) ?? article.saveCount;
    const meLiked = meLikedResult?.[1] === 1;
    const meSaved = meSavedResult?.[1] === 1;
    console.log(
      `For article ${article.id}, likeCount: ${likeCount}, saveCount: ${saveCount}, meLiked: ${meLiked}, meSaved: ${meSaved}`
    );

    return {
      ...article,
      likeCount,
      saveCount,
      isLiked: meLiked,
      isSaved: meSaved,
    };
  });
};
