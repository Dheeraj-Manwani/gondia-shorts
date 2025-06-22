"use server";

import React from "react";
import { SwipeableNewsFeed } from "@/components/news-feeds/SwipeableNewsFeed";
import { getArticleBySlug } from "@/actions/articles";
import { ArticleType } from "@prisma/client/index-browser";
import { getThumbnailFromYouTube } from "@/actions/misc";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { article?: string | undefined };
}): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  if (!awaitedSearchParams.article) return {};
  const article = await getArticleBySlug(awaitedSearchParams.article);
  if (!article) return {};

  const mediaUrl =
    article?.type == ArticleType.VIDEO_N_TEXT
      ? article?.imageUrls?.[0]
      : article?.type == ArticleType.YOUTUBE
      ? getThumbnailFromYouTube(article?.videoUrl)
      : "https://your-default-image.jpg";

  return {
    title: article.title,
    description: "Read this article on Gondia Shorts",
    openGraph: {
      title: article.title,
      description: article.content || "",
      url: `https://gondia-shorts.vercel.app?article=${article.slug}`,
      images: [
        {
          url: mediaUrl ?? "https://your-default-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Home(props: {
  searchParams: { article?: string };
}) {
  // const awaitedProps = await props;
  console.log("searchParams ", (await props.searchParams).article);
  const articleSlug = (await props.searchParams).article;

  return <SwipeableNewsFeed categoryId={0} articleSlug={articleSlug} />;
}
