"use server";

import prisma from "@/db/db";
import { Article } from "@/db/schema/article";
import { redis } from "@/lib/redis";
import chalk from "chalk";

export const updateCountsFromRedis = async (
  articles: Article[],
  userId?: number
): Promise<Article[]> => {
  const pipeline = redis.pipeline();

  // Queue SCARD and SISMEMBER commands for each article
  articles.forEach((article) => {
    pipeline.scard(`article:${article.id}:likes`);
    pipeline.scard(`article:${article.id}:saves`);
    if (userId) {
      pipeline.sismember(`article:${article.id}:likes`, userId);
      pipeline.sismember(`article:${article.id}:saves`, userId);
    }
  });

  const results = await pipeline.exec();

  return articles.map((article, idx) => {
    const likeCountResult = userId ? results?.[idx * 4] : results?.[idx * 2];
    const saveCountResult = userId
      ? results?.[idx * 4 + 1]
      : results?.[idx * 2 + 1];
    const meLikedResult = userId ? results?.[idx * 4 + 2] : [-1, -1];
    const meSavedResult = userId ? results?.[idx * 4 + 3] : [-1, -1];

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

export const likeArticle = async (
  articleId: number,
  userId: number,
  shouldLike: boolean
): Promise<boolean> => {
  try {
    const setKey = `article:${articleId}:likes`;
    const countKey = `article:${articleId}:likeCount`;
    let added = 0,
      newCount = 0;

    if (shouldLike) {
      // Add user to set (returns 1 if newly added)
      added = await redis.sadd(setKey, userId);
      console.log(
        chalk.green("Linking article setKey, userId, added"),
        setKey,
        userId,
        added
      );

      await prisma.interaction.upsert({
        where: {
          userId_articleId_type: {
            userId,
            articleId,
            type: "LIKE",
          },
        },
        create: {
          userId,
          articleId,
          type: "LIKE",
        },
        update: {
          createdAt: new Date(),
        },
      });
      if (added == 1) newCount = await redis.incr(countKey);
    } else {
      // Remove user from set (returns 1 if user was in set)
      added = await redis.srem(setKey, userId);
      console.log(
        chalk.yellow("Unlinking article setKey, userId, added"),
        setKey,
        userId,
        added
      );

      await prisma.interaction.deleteMany({
        where: {
          userId,
          articleId,
          type: "LIKE",
        },
      });

      if (added == 1) newCount = await redis.decr(countKey);
    }

    if (added === 1 && newCount % 5 === 0) {
      // If new count is divisible by 5, update DB
      console.log(
        chalk.redBright(
          "updating article count in db ============================={ id: articleId }, { likeCount: newCount }:::::: "
        ),
        { id: articleId },
        { likeCount: newCount }
      );
      await prisma.article.update({
        where: { id: articleId },
        data: { likeCount: newCount },
      });
    }
    return true;
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};

export const saveArticle = async (
  articleId: number,
  userId: number,
  shouldLike: boolean
): Promise<boolean> => {
  try {
    if (shouldLike) {
      await prisma.interaction.upsert({
        where: {
          userId_articleId_type: {
            userId,
            articleId,
            type: "SAVE",
          },
        },
        create: {
          userId,
          articleId,
          type: "SAVE",
        },
        update: {
          createdAt: new Date(),
        },
      });
    } else {
      await prisma.interaction.deleteMany({
        where: {
          userId,
          articleId,
          type: "SAVE",
        },
      });
    }

    return true;
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};
