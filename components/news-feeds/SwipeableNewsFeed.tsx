"use client";

import React, { useEffect, useState, useRef } from "react";
// import { useQuery } from '@tanstack/react-query';
// import { Article } from '@shared/schema';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import NewsCard from "../news-card/NewsCard";
import { v4 as uuid } from "uuid";

// Import required modules from swiper
import { Virtual, Mousewheel, Keyboard, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
// import { translateToHindi } from "@/lib/translateService";
import { Article } from "@/db/schema/article";
import { useAction } from "@/hooks/use-action";
import { fetchArticles } from "@/actions/articles";
import { NewsCardSkeleton } from "../Skeletons";
import { appSession } from "@/lib/auth";
import { useArticles } from "@/store/articles";
import { useSession } from "next-auth/react";
import { getInteractionsFromArticles } from "@/lib/converters";
import { useInteractions } from "@/store/interaction";
import chalk from "chalk";

interface SwipeableNewsFeedProps {
  categoryId: number;
  articleSlug?: string | null;
}

const SwipeableNewsFeedComp: React.FC<SwipeableNewsFeedProps> = ({
  categoryId,
  articleSlug,
}) => {
  const [page, setPage] = useState(0);
  const articles = useArticles((state) => state.articles);
  const setArticles = useArticles((state) => state.setArticles);
  // const interactions = useInteractions((state) => state.interactions);
  const setInteractions = useInteractions((state) => state.setInteractions);
  // const [isHindi, setIsHindi] = useState(false);
  const limit = Number(process.env.NEXT_PUBLIC_FETCH_LIMIT); // Number of articles to fetch at once
  const swiperRef = useRef<SwiperType | null>(null);
  const session = useSession() as unknown as appSession;

  const { execute, data, isLoading, error } = useAction(fetchArticles, {
    toastMessages: {
      loading:
        articles.length == 0
          ? `Loading first ${limit} articles...`
          : `Loading next ${limit} articles...`,
      success: "Articles loaded successfully!!",
      error: "Failed to load articles",
    },
  });

  // Update articles when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const articleData = data as Article[];
      const interactionData = getInteractionsFromArticles(articleData);
      // setArticles((prev) => [...prev, ...articleData]);
      const newArticles = [...articles, ...articleData];
      setArticles(newArticles);

      // const newInteractions = [...interactions, ...interactionData];
      setInteractions(interactionData, true);
      console.log("newArticles ======= ", newArticles);
    }
  }, [data]);

  // Reset articles and page when category changes
  useEffect(() => {
    setArticles([]);
    setPage(0);
    if (
      !isLoading &&
      (session.status === "unauthenticated" ||
        session.status === "authenticated")
    )
      execute({
        limit,
        offset: 0,
        articleSlug: articleSlug ?? undefined,
        session,
      });
    // Reset swiper to first slide when category changes
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0);
    }
  }, [categoryId, session.status]);

  // Load more articles when reaching the end
  // const handleReachEnd = () => {
  //   console.log(
  //     "handleReachEnd called ::::::: 🔚🔚🔚🔚🔚🔚🔚🔚",
  //     isLoading,
  //     data,
  //     page
  //   );
  //   if (!isLoading && data && data.length >= limit) {
  // setPage((prevPage) => prevPage + 1);
  //   }
  // };

  const handleSwipe = async (swiper: SwiperType) => {
    const currentIndex = swiper.realIndex ?? 0;
    const previousIndex = swiper.previousIndex ?? 0;
    const fetchThreshold = Number(process.env.NEXT_PUBLIC_FETCH_BEFORE) || 4;
    const shouldFetch = currentIndex === articles.length - fetchThreshold;
    const swipedForward = currentIndex > previousIndex;

    setPage(() => currentIndex);

    console.log("swiper real index => ", currentIndex, "limit ===> ", limit);
    console.log(
      "shouldFetch => ",
      shouldFetch,
      "swipedForward => ",
      swipedForward
    );

    if (shouldFetch && swipedForward) {
      console.log(chalk.red("Fetching more articles..."));
      await execute({
        limit,
        offset: articles.length,
        session,
      });
    }
  };

  // Handle navigation actions
  // const handlePrevCard = () => {
  //   if (swiperRef.current) {
  //     swiperRef.current.slidePrev();
  //   }
  // };

  // const handleNextCard = () => {
  //   if (swiperRef.current) {
  //     swiperRef.current.slideNext();
  //   }
  // };

  // Initial loading state
  if (page === 0 && isLoading) {
    return (
      // <div className="h-screen w-full pt-14 flex items-center justify-center">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      // </div>
      <NewsCardSkeleton />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-full pt-14 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
          <p>Failed to load news articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full  relative">
      {/* Add padding top for header */}
      <Swiper
        modules={[Virtual, Mousewheel, Keyboard, Navigation]}
        direction="vertical"
        spaceBetween={0}
        slidesPerView={1}
        virtual
        mousewheel
        keyboard
        // onReachEnd={handleReachEnd}
        className="h-full"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          handleSwipe(swiper);
        }}
      >
        {articles.map((article, index) => (
          <SwiperSlide
            virtualIndex={index}
            className="h-full w-full"
            key={uuid()}
          >
            <NewsCard
              article={article}
              isCurrentActive={page === index}
              key={uuid()}
            />
          </SwiperSlide>
        ))}

        {/* Loading indicator at the bottom */}
        {/* {isLoading && (
          <SwiperSlide className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </SwiperSlide>
        )} */}

        {/* No more articles message */}
        {!isLoading && data && page > 0 && (
          <SwiperSlide className="h-full flex items-center justify-center">
            <div className="text-center text-gray-700 px-6 py-8 bg-white rounded-lg shadow-lg border border-gray-200">
              <p className="text-lg font-semibold">You’ve reached the end!</p>
              <p className="text-sm text-gray-500 mt-2">
                No more articles to load at the moment.
              </p>
              <button
                onClick={() => {
                  setPage(0);
                  if (swiperRef.current) {
                    swiperRef.current.slideTo(0, 0);
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                Back to start
              </button>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
      {/* Swipe indicator */}
      {articles.length > 0 && page == 0 && (
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-300 drop-shadow-md"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-zinc-400 font-medium drop-shadow-md">
              Swipe up for next
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const SwipeableNewsFeed = React.memo(
  SwipeableNewsFeedComp,
  (prevProps, nextProps) => {
    // Prevent re-render if article id is the same
    return (
      prevProps.articleSlug === nextProps.articleSlug &&
      prevProps.categoryId === nextProps.categoryId
    );
  }
);
SwipeableNewsFeed.displayName = "SwipeableNewsFeed";
