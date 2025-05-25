"use server";

import { redis } from "@/lib/redis";
import prisma from "@/db/db";
import chalk from "chalk";

export const likeComment = async (commentId: number, userId: number) => {
  const key = `comment:${commentId}:likes`;
  return await redis.sadd(key, userId);
};

export const unlikeComment = async (commentId: number, userId: number) => {
  const key = `comment:${commentId}:likes`;
  return await redis.srem(key, userId);
};

export const getCommentLikes = async (commentId: number) => {
  const key = `comment:${commentId}:likes`;
  return await redis.scard(key);
};

export const hasUserLikedComment = async (
  commentId: number,
  userId: number
) => {
  const key = `comment:${commentId}:likes`;
  return await redis.sismember(key, userId);
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

export const unlikeArticle = async (articleId: number, userId: number) => {
  const key = `article:${articleId}:likes`;
  return await redis.srem(key, userId);
};

export const getArticleLikes = async (articleId: number) => {
  const key = `article:${articleId}:likes`;
  return await redis.scard(key);
};

export const saveArticle = async (articleId: number, userId: number) => {
  const key = `user:${userId}:savedArticles`;
  return await redis.sadd(key, articleId);
};
export const unsaveArticle = async (articleId: number, userId: number) => {
  const key = `user:${userId}:savedArticles`;
  return await redis.srem(key, articleId);
};

export const getArticleSaves = async (articleId: number): Promise<number> => {
  const key = `article:${articleId}:saves`;
  return await redis.scard(key);
};
