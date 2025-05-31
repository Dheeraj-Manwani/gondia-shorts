// "use server";

// import { redis } from "@/lib/redis";
// import prisma from "@/db/db";
// import chalk from "chalk";

// export const likeComment = async (commentId: number, userId: number) => {
//   const key = `comment:${commentId}:likes`;
//   return await redis.sadd(key, userId);
// };

// export const unlikeComment = async (commentId: number, userId: number) => {
//   const key = `comment:${commentId}:likes`;
//   return await redis.srem(key, userId);
// };

// export const getCommentLikes = async (commentId: number) => {
//   const key = `comment:${commentId}:likes`;
//   return await redis.scard(key);
// };

// export const hasUserLikedComment = async (
//   commentId: number,
//   userId: number
// ) => {
//   const key = `comment:${commentId}:likes`;
//   return await redis.sismember(key, userId);
// };

// export const unlikeArticle = async (articleId: number, userId: number) => {
//   const key = `article:${articleId}:likes`;
//   return await redis.srem(key, userId);
// };

// export const getArticleLikes = async (articleId: number) => {
//   const key = `article:${articleId}:likes`;
//   return await redis.scard(key);
// };

// export const saveArticle = async (articleId: number, userId: number) => {
//   const key = `user:${userId}:savedArticles`;
//   return await redis.sadd(key, articleId);
// };
// export const unsaveArticle = async (articleId: number, userId: number) => {
//   const key = `user:${userId}:savedArticles`;
//   return await redis.srem(key, articleId);
// };

// export const getArticleSaves = async (articleId: number): Promise<number> => {
//   const key = `article:${articleId}:saves`;
//   return await redis.scard(key);
// };
