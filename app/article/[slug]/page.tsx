"use server";

import React from "react";
import { SwipeableNewsFeed } from "@/components/news-feeds/SwipeableNewsFeed";
import { getArticleBySlug } from "@/actions/articles";
import { getThumbnailFromYouTube } from "@/actions/misc";
import { ArticleType } from "@prisma/client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = (await params).slug;
  if (!slug) return {};
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const mediaUrl =
    (article.type === ArticleType.YOUTUBE
      ? getThumbnailFromYouTube(article.videoUrl)
      : article.imageUrls?.[0] || "https://your-default-image.jpg") ?? "";

  console.log("returning as metadata", {
    title: article.title,
    description: "Read this article on Gondia Shorts",
    openGraph: {
      title: article.title,
      description: article.content?.slice(0, 120) || "",
      url: `https://gondia-shorts.vercel.app/article/${article.slug}`,
      images: [
        {
          url: mediaUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content?.slice(0, 120) || "",
      images: [mediaUrl],
    },
  });

  return {
    title: article.title,
    description: "Read this article on Gondia Shorts",
    openGraph: {
      title: article.title,
      description: article.content?.slice(0, 120) || "",
      url: `https://gondia-shorts.vercel.app/article/${article.slug}`,
      images: [
        {
          url: mediaUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content?.slice(0, 120) || "",
      images: [mediaUrl],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;
  console.log("article slug ", slug);

  return <SwipeableNewsFeed categoryId={0} articleSlug={slug} />;
}
