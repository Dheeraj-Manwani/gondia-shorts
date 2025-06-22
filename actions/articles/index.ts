"use server";

import prisma from "@/db/db";
// import { seed } from "../data";
// import { sampleArticles } from "@/lib/data";
import { appSession } from "@/lib/auth";
import { Article } from "@/db/schema/article";
import { InteractionType } from "@/db/schema/interaction";
import { isAuthorised } from "@/lib/utils";
import { getInteractedArticles } from "./interacted-articles";
// import { updateCountsFromRedis } from "../interaction/articleInteractions";

interface FetchParams {
  categoryId?: number; // optional now
  articleSlug?: string;
  limit: number;
  offset: number;
  session: appSession;
  interactionType?: InteractionType;
}

export const getArticleBySlug = async (slug: string) => {
  return await prisma.article.findFirst({
    select: {
      id: true,
      title: true,
      content: true,
      imageUrls: true,
      videoUrl: true,
      type: true,
      slug: true,
      sourceLogoUrl: true,
      categoryId: true,
      submittedById: true,
      createdAt: true,
      likeCount: true,
    },
    where: {
      slug: slug,
    },
  });
};

async function getCombinedArticles(
  categoryId: number | undefined,
  limit: number,
  offset: number,
  articleSlug: string | undefined
) {
  let mainArticle: Article | null = null;

  if (articleSlug) {
    mainArticle = await getArticleBySlug(articleSlug);
  }

  // Fetch other articles (excluding the main one by ID or slug)
  const otherArticles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      imageUrls: true,
      videoUrl: true,
      type: true,
      slug: true,
      sourceLogoUrl: true,
      categoryId: true,
      submittedById: true,
      createdAt: true,
      likeCount: true,
    },
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(mainArticle ? { slug: { not: articleSlug } } : {}),
    },
    orderBy: {
      id: "desc",
    },
    take: limit,
    skip: offset,
  });

  const articles = mainArticle
    ? [mainArticle, ...otherArticles]
    : otherArticles;
  return articles;
}

export const fetchArticles = async (
  fetchParams: FetchParams
): Promise<{ success: boolean; data: Article[] }> => {
  const { categoryId, limit, offset, articleSlug, session, interactionType } =
    fetchParams;

  try {
    let articles: Article[] = [];
    if (!interactionType) {
      articles = await getCombinedArticles(
        categoryId,
        limit,
        offset,
        articleSlug
      );
    } else if (isAuthorised(session)) {
      articles = await getInteractedArticles(
        Number(session.data.user?.id),
        interactionType
      );
    }

    const articleIds = articles.map((article) => article.id);

    if (isAuthorised(session)) {
      const interactions = await prisma.interaction.findMany({
        select: {
          id: true,
          userId: true,
          articleId: true,
          type: true,
        },
        where: {
          userId: Number(session.data.user?.id),
          articleId: {
            in: articleIds,
          },
        },
      });

      articles = articles.map((article) => {
        const interactionTypes = new Set(["LIKE", "SAVE"]);

        const interactionMap = interactions.reduce<Record<string, boolean>>(
          (acc, interaction) => {
            if (
              interaction.articleId === article.id &&
              interactionTypes.has(interaction.type)
            ) {
              acc[interaction.type] = true;
            }
            return acc;
          },
          {}
        );

        return {
          ...article,
          isLiked: !!interactionMap["LIKE"],
          isSaved: !!interactionMap["SAVE"],
        };
      });
    }

    return { success: true, data: articles };
  } catch (e) {
    console.log("Error occured while fetching articles", e);
    return { success: false, data: [] };
  }

  // if (
  //   session.status === "authenticated" &&
  //   session.data.user &&
  //   session.data.user.id
  // ) {
  // try {
  //   const updatedArticles = await updateCountsFromRedis(
  //     articles,
  //     Number(session.data.user?.id)
  //   );
  //   articles = updatedArticles;
  // } catch (e) {
  // }
  // }

  // await seed();

  // ! For dev
  // const articles = sampleArticles.slice(offset, offset + limit);

  // return { success: true, data: articles };
};
