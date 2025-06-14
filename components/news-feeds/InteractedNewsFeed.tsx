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
import {
  Virtual,
  Mousewheel,
  Keyboard,
  Navigation,
  FreeMode,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
// import { translateToHindi } from "@/lib/translateService";
import { Article } from "@/db/schema/article";
import { useAction } from "@/hooks/use-action";
import { fetchArticles } from "@/actions/articles";
import { NewsCardSkeleton } from "../Skeletons";
import { appSession } from "@/lib/auth";
import { useArticles } from "@/store/articles";
import { InteractionType } from "@prisma/client/index-browser";
import { useSession } from "next-auth/react";

interface InteractedNewsFeedProps {
  interactionType: InteractionType;
}

const InteractedNewsFeed: React.FC<InteractedNewsFeedProps> = ({
  interactionType,
}) => {
  const session = useSession() as unknown as appSession;

  const [page, setPage] = useState(0);
  const articles = useArticles((state) => state.articles);
  const setArticles = useArticles((state) => state.setArticles);
  // const [isHindi, setIsHindi] = useState(false);
  const limit = Number(process.env.NEXT_PUBLIC_FETCH_LIMIT); // Number of articles to fetch at once
  const swiperRef = useRef<SwiperType | null>(null);

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
      const newArticles = [...articles, ...articleData];
      setArticles(newArticles);
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
        articleSlug: undefined,
        session,
        interactionType,
      });
    // Reset swiper to first slide when category changes
    // if (swiperRef.current) {
    //   swiperRef.current.slideTo(0, 0);
    // }
  }, [session.status]);

  const handleSwipe = async (swiper: SwiperType) => {
    const currentIndex = swiper.realIndex ?? 0;
    const previousIndex = swiper.previousIndex ?? 0;
    const fetchThreshold = Number(process.env.NEXT_PUBLIC_FETCH_BEFORE) || 4;
    const shouldFetch = currentIndex === articles.length - fetchThreshold;
    const swipedForward = currentIndex > previousIndex;

    setPage(() => currentIndex);

    console.log("swiper real index => ", currentIndex);
    console.log("swiper previous index => ", previousIndex);

    if (shouldFetch && swipedForward) {
      console.log("Fetching more articles...");
      await execute({
        limit,
        offset: articles.length,
        session,
        interactionType,
      });
    }
  };

  // Initial loading state
  if (page === 0 && isLoading) {
    return <NewsCardSkeleton />;
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
    <div className="h-screen w-full relative">
      {/* Add padding top for header */}
      <Swiper
        modules={[Virtual, Mousewheel, Keyboard, Navigation, FreeMode]}
        direction="vertical"
        freeMode={true}
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
            {/* <div className="m-2 border-0 shadow-accent rounded-md "> */}
            <div className="m-2 border border-gray-500 rounded-2xl shadow-md  transition hover:shadow-lg">
              <NewsCard
                article={article}
                isCurrentActive={page === index}
                key={uuid()}
              />
            </div>
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
    </div>
  );
};

export default InteractedNewsFeed;
