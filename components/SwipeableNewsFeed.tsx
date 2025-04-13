import React, { useEffect, useState, useRef } from "react";
// import { useQuery } from '@tanstack/react-query';
// import { Article } from '@shared/schema';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import NewsCard from "./NewsCard";

// Import required modules from swiper
import { Virtual, Mousewheel, Keyboard, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { translateToHindi } from "@/lib/translateService";
import { Article } from "@/db/schema/news";
import { useAction } from "@/hooks/use-action";
import { fetchArticles } from "@/actions/news";

interface SwipeableNewsFeedProps {
  categoryId: number;
}

const SwipeableNewsFeed: React.FC<SwipeableNewsFeedProps> = ({
  categoryId,
}) => {
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isHindi, setIsHindi] = useState(false);
  const limit = 10; // Number of articles to fetch at once
  const swiperRef = useRef<SwiperType | null>(null);

  // const { data, isLoading, error } = useQuery<Article[]>({
  //   queryKey: ['/api/articles', { categoryId, limit, offset: page * limit }],
  //   enabled: true,
  // });

  const { execute, data, isLoading, error } = useAction(fetchArticles);

  // Update articles when data changes
  useEffect(() => {
    console.log("data inside use eff ", data);
    if (data && data.length > 0) {
      const articleData = data as Article[];
      if (page === 0) {
        setArticles(articleData);
      } else {
        setArticles((prev) => [...prev, ...articleData]);
      }
    }
  }, [data, page]);

  // Reset articles and page when category changes
  useEffect(() => {
    setArticles([]);
    setPage(0);
    execute({});

    // Reset swiper to first slide when category changes
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0);
    }
  }, [categoryId]);

  // Load more articles when reaching the end
  const handleReachEnd = () => {
    if (!isLoading && data && data.length >= limit) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle navigation actions
  const handlePrevCard = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextCard = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // Initial loading state
  if (page === 0 && isLoading) {
    return (
      <div className="h-screen w-full pt-14 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
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
    <div className="h-screen w-full pt-14 relative">
      {" "}
      {/* Add padding top for header */}
      <Swiper
        modules={[Virtual, Mousewheel, Keyboard, Navigation]}
        direction="vertical"
        spaceBetween={0}
        slidesPerView={1}
        virtual
        mousewheel
        keyboard
        onReachEnd={handleReachEnd}
        className="h-full"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {articles.map((article, index) => (
          <SwiperSlide
            key={article.id}
            virtualIndex={index}
            className="h-full w-full"
          >
            <NewsCard article={article} />
          </SwiperSlide>
        ))}

        {/* Loading indicator at the bottom */}
        {isLoading && (
          <SwiperSlide className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </SwiperSlide>
        )}

        {/* No more articles message */}
        {!isLoading && data && data.length === 0 && page > 0 && (
          <SwiperSlide className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500 px-6 py-4 bg-gray-50 rounded-lg shadow-sm">
              <p>No more articles to load</p>
              <button
                onClick={() => setPage(0)}
                className="mt-3 text-blue-600 text-sm underline"
              >
                Back to start
              </button>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
      {/* Swipe indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white drop-shadow-md"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-white font-medium drop-shadow-md">
            Swipe up for next
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwipeableNewsFeed;
