"use server";

import React from "react";
// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";
import { SwipeableNewsFeed } from "@/components/news-feeds/SwipeableNewsFeed";
import { getArticleBySlug } from "@/actions/articles";
import { Article } from "@/db/schema/article";
import Head from "next/head";
import { ArticleType } from "@prisma/client/index-browser";
import { getThumbnailFromYouTube } from "@/actions/misc";
import { Metadata } from "next";
// import { useSearchParams } from "next/navigation";

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

const Home = ({
  article,
  articleSlug,
}: {
  article: Article | null;
  articleSlug: string | null;
}) => {
  // const [selectedCategoryId, setSelectedCategoryId] = useState(1); // Default to "All" category
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const handleMenuClick = () => {
  //   setSidebarOpen(true);
  // };

  // const handleCloseSidebar = () => {
  //   setSidebarOpen(false);
  // };
  // const searchParams = useSearchParams();
  // const articleSlug = searchParams.get("article");
  // const imageUrl =
  //   article?.type == ArticleType.VIDEO_N_TEXT
  //     ? article?.imageUrls?.[0]
  //     : article?.type == ArticleType.YOUTUBE
  //     ? getThumbnailFromYouTube(article?.videoUrl)
  //     : "https://your-default-image.jpg";
  // const fullUrl = `https://gondia-shorts.vercel.app?article=${article?.slug}`;

  return (
    <>
      {/* {article && (
        <Head>
          <title>{article.title}</title>
          <meta property="og:title" content={article.title} />
          <meta
            property="og:description"
            content={"Read this article on Gondia Shorts"}
          />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:url" content={fullUrl} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
      )} */}

      <SwipeableNewsFeed
        categoryId={0}
        articleSlug={articleSlug}
        // session={session}
      />
    </>
  );
};

export default Home;
