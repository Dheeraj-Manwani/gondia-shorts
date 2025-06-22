"use client";

import React, { useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import NewsCard from "../news-card/NewsCard";
import { v4 as uuid } from "uuid";
import { Article } from "@/db/schema/article";
import { useAction } from "@/hooks/use-action";
import { fetchArticles } from "@/actions/articles";
import { InteractedCardSkeleton } from "../Skeletons";
import { appSession } from "@/lib/auth";
import { useArticles } from "@/store/articles";
import { InteractionType } from "@prisma/client/index-browser";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { getInteractionsFromArticles } from "@/lib/converters";
import { useInteractions } from "@/store/interaction";

interface InteractedNewsFeedProps {
  interactionType: InteractionType;
}

const InteractedNewsFeed: React.FC<InteractedNewsFeedProps> = ({
  interactionType,
}) => {
  const session = useSession() as unknown as appSession;
  // const [page, setPage] = useState(1);
  const articles = useArticles((state) => state.articles);
  const setArticles = useArticles((state) => state.setArticles);
  const setInteractions = useInteractions((state) => state.setInteractions);

  const limit = Number(process.env.NEXT_PUBLIC_FETCH_LIMIT); // Number of articles to fetch at once

  const { execute, data, isLoading, error } = useAction(fetchArticles, {
    toastMessages: {
      loading:
        articles.length == 0
          ? `Loading first ${interactionType} ${limit} articles...`
          : `Loading next ${interactionType} ${limit} articles...`,
      success: "Articles loaded successfully!!",
      error: "Failed to load articles",
    },
  });

  // Update articles when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const articleData = data as Article[];
      // setArticles((prev) => [...prev, ...articleData]);
      const interactionData = getInteractionsFromArticles(articleData);
      setInteractions(interactionData, true);

      const newArticles = [...articles, ...articleData];
      setArticles(newArticles);
      console.log("newArticles ======= ", newArticles);
    }
  }, [data]);

  // Reset articles and page when category changes
  useEffect(() => {
    setArticles([]);
    if (!isLoading && session.status === "authenticated")
      execute({
        limit,
        offset: 0,
        articleSlug: undefined,
        session,
        interactionType,
      });
  }, [session.status]);

  // const observer = useRef<IntersectionObserver | null>(null);

  // const lastObservedRef = useCallback(
  //   (node: HTMLDivElement | null) => {
  //     if (isLoading) return;
  //     if (observer.current) observer.current.disconnect();

  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting) {
  //         setPage((prev) => prev + 1);
  //       }
  //     });

  //     if (node) observer.current.observe(node);
  //   },
  //   [isLoading]
  // );

  // useEffect(() => {
  //   if (page === 1) return; // already fetched
  //   execute({
  //     limit,
  //     offset: articles.length,
  //     session,
  //     interactionType,
  //   });
  // }, [page]);

  // const handleSwipe = async (swiper: SwiperType) => {
  //   const currentIndex = swiper.realIndex ?? 0;
  //   const previousIndex = swiper.previousIndex ?? 0;
  //   const fetchThreshold = Number(process.env.NEXT_PUBLIC_FETCH_BEFORE) || 4;
  //   const shouldFetch = currentIndex === articles.length - fetchThreshold;
  //   const swipedForward = currentIndex > previousIndex;

  //   setPage(() => currentIndex);

  //   console.log("swiper real index => ", currentIndex);
  //   console.log("swiper previous index => ", previousIndex);

  //   if (shouldFetch && swipedForward) {
  //     console.log("Fetching more articles...");
  //     await execute({
  //       limit,
  //       offset: articles.length,
  //       session,
  //       interactionType,
  //     });
  //   }
  // };

  // Initial loading state
  if (isLoading) {
    return <InteractedCardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
          <p>Failed to load news articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {articles.map((article, index) => (
        <div
          className="m-3 mb-10 border border-gray-500 shadow-md  transition hover:shadow-lg"
          key={index}
        >
          <NewsCard
            article={article}
            isCurrentActive={false}
            key={uuid()}
            // isPreviewActive={false}
          />
        </div>
      ))}

      {session.status == "authenticated" && !isLoading && (
        <div
          className={twMerge(
            "flex flex-col align-middle justify-center gap-2",
            articles.length == 0 && "mt-4"
          )}
        >
          <div className="text-center">
            {articles.length > 0
              ? "No more articles to show 😊"
              : `Your ${
                  interactionType == "LIKE" ? "liked" : "saved"
                } articles will be visible here 😊`}
          </div>
          <Link
            href={"/"}
            className=" hover:text-gray-200 text-center bg-black text-white rounded-md m-auto py-1 px-4 mt-1"
          >
            Go to feed
          </Link>
        </div>
      )}
    </div>
  );
};

export default InteractedNewsFeed;
