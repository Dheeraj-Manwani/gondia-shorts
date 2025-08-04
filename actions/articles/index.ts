"use server";

import prisma from "@/db/db";
// import { seed } from "../data";
// import { sampleArticles } from "@/lib/data";
import { appSession } from "@/lib/auth";
import { Article } from "@/db/schema/article";
import { InteractionType } from "@/db/schema/interaction";
import { isAuthorised } from "@/lib/utils";
import { getInteractedArticles } from "./interacted-articles";
// import { seed } from "../data";
// import { updateCountsFromRedis } from "../interaction/articleInteractions";
import { authConfig } from "@/lib/auth";
import { Role } from "@prisma/client/index-browser";
import { getServerSession } from "next-auth";

interface FetchParams {
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
      submittedById: true,
      createdAt: true,
      likeCount: true,
      videoStartTime: true,
      isPublic: true,
    },
    where: {
      slug: slug,
    },
  });
};

async function getCombinedArticles(
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
      submittedById: true,
      createdAt: true,
      likeCount: true,
      videoStartTime: true,
      isPublic: true,
    },
    where: {
      ...(mainArticle ? { slug: { not: articleSlug } } : {}),
      isPublic: true,
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
  // await seed();
  // return { success: true, data: [] }; // For dev, remove this line later
  const { limit, offset, articleSlug, session, interactionType } = fetchParams;

  try {
    let articles: Article[] = [];
    if (!interactionType) {
      articles = await getCombinedArticles(limit, offset, articleSlug);
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

  // ! For dev
  // const articles = sampleArticles.slice(offset, offset + limit);

  // return { success: true, data: articles };
};

export const getAllArticles = async () => {
  // @ts-expect-error to be taken care of
  const session: session | null = await getServerSession(authConfig);

  if (!session || !session?.user?.id || session?.user?.role !== Role.ADMIN) {
    return { error: "UNAUTHORISED" };
  }

  try {
    const articles = await prisma.article.findMany({
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            isRestricted: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: articles };
  } catch (e) {
    console.log("Error fetching articles", e);
    return { success: false, error: "Error fetching articles" };
  }
};

export const deleteArticle = async (articleId: number) => {
  // @ts-expect-error to be taken care of
  const session: session | null = await getServerSession(authConfig);

  if (!session || !session?.user?.id || session?.user?.role !== Role.ADMIN) {
    return { error: "UNAUTHORISED" };
  }

  try {
    await prisma.comment.deleteMany({
      where: {
        articleId,
      },
    });

    await prisma.article.delete({
      where: { id: articleId },
    });

    await prisma.article.delete({
      where: { id: articleId },
    });

    return { success: true };
  } catch (e) {
    console.log("Error deleting article", e);
    return { success: false, error: "Error deleting article" };
  }
};

export const updateArticle = async (
  articleId: number,
  data: {
    title?: string;
    content?: string;
    type?: any;
    videoUrl?: string | null;
    videoStartTime?: number | null;
    imageUrls?: string[];
    source?: string;
    author?: string;
    isPublic?: boolean;
  }
) => {
  // @ts-expect-error to be taken care of
  const session: session | null = await getServerSession(authConfig);

  if (!session || !session?.user?.id || session?.user?.role !== Role.ADMIN) {
    return { error: "UNAUTHORISED" };
  }

  try {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.type && { type: data.type }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.videoStartTime !== undefined && {
          videoStartTime: data.videoStartTime,
        }),
        ...(data.imageUrls && { imageUrls: data.imageUrls }),
        ...(data.source && { source: data.source }),
        ...(data.author && { author: data.author }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
    });

    return { success: true, data: article };
  } catch (e) {
    console.log("Error updating article", e);
    return { success: false, error: "Error updating article" };
  }
};
