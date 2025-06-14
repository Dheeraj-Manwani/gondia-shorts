"use server";

import prisma from "@/db/db";
import { Article } from "@/db/schema/article";
import { redis } from "@/lib/redis";
import chalk from "chalk";

export const likeArticle = async (
  articleId: number,
  userId: number,
  shouldLike: boolean
): Promise<boolean> => {
  try {
    if (shouldLike) {
      const existing = await prisma.interaction.findFirst({
        where: {
          userId,
          articleId,
          type: "LIKE",
        },
      });

      if (!existing) {
        const trx = await prisma.$transaction([
          prisma.interaction.upsert({
            where: {
              userId_articleId_type: {
                userId,
                articleId,
                type: "LIKE",
              },
            },
            update: {
              createdAt: new Date(),
            },
            create: {
              userId,
              articleId,
              type: "LIKE",
            },
          }),
          prisma.article.update({
            where: { id: articleId },
            data: {
              likeCount: {
                increment: 1,
              },
            },
          }),
        ]);
        return true;
      }
      return false;
    } else {
      // Remove user from set (returns 1 if user was in set)

      const { count } = await prisma.interaction.deleteMany({
        where: {
          userId,
          articleId,
          type: "LIKE",
        },
      });

      if (count > 0) {
        await prisma.article.update({
          where: { id: articleId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};

export const saveArticle = async (
  articleId: number,
  userId: number,
  shouldSave: boolean
): Promise<boolean> => {
  try {
    if (shouldSave) {
      const existing = await prisma.interaction.findFirst({
        where: {
          userId,
          articleId,
          type: "SAVE",
        },
      });

      if (!existing) {
        await prisma.interaction.upsert({
          where: {
            userId_articleId_type: {
              userId,
              articleId,
              type: "SAVE",
            },
          },
          update: {},
          create: {
            userId,
            articleId,
            type: "SAVE",
          },
        });

        return true;
      }
      return false;
    } else {
      const { count } = await prisma.interaction.deleteMany({
        where: {
          userId,
          articleId,
          type: "SAVE",
        },
      });

      return count > 0;
    }
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};
