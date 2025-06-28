"use server";

import prisma from "@/db/db";
import { CreateArticle } from "@/db/schema/article";
import { authConfig } from "@/lib/auth";
import { Role } from "@prisma/client/index-browser";
import { getServerSession } from "next-auth";

async function generateUniqueSlug(title: string): Promise<string> {
  try {
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    let uniqueSlug = slug;
    let count = 1;

    while (1) {
      console.log("Trying for slug ", uniqueSlug);
      const slugRecords = await prisma.article.findFirst({
        select: { id: true },
        where: { slug: uniqueSlug },
      });

      console.log("slugRecords  ", slugRecords);
      if (!slugRecords || !slugRecords.id) break;

      uniqueSlug = `${slug}-${count}`;
      count++;
    }
    // const uniqueSlug = `${slug}-${uuid()}`;
    return uniqueSlug;
  } catch (e) {
    console.log("Error occured while creating slug", e);
    return "error occured while creating slug";
  }
}

export const createArticle = async (article: CreateArticle) => {
  // @ts-expect-error to be taken care of
  const session: session | null = await getServerSession(authConfig);
  console.log("createArticle called with ", article, Number(session.user.id));

  if (!session || !session?.user?.id || !session?.user?.role) {
    return { error: "UNAUTHORISED" };
  }

  if (
    session?.user?.role !== Role.ADMIN &&
    session?.user?.role !== Role.PUBLISHER
  ) {
    return { error: "UNAUTHORISED" };
  }

  try {
    const slug = await generateUniqueSlug(article.title);

    const res = await prisma.article.create({
      data: {
        title: article.title,
        content: article.content,
        type: article.type,
        slug: slug,
        imageUrls: article.imageUrls,
        videoUrl: article.videoUrl,

        submittedById: Number(session.user.id),
        categoryId: 1,

        source: article.sourceText ?? "",
        sourceLogoUrl: article.sourceLogoUrl,
        author: article.author ?? "",
      },
    });

    return { success: true, data: res, routeParam: res.slug };
  } catch (e) {
    console.log("Error occured while creating article", e);
    return { success: false, error: "Error occured while creating article" };
  }
};
