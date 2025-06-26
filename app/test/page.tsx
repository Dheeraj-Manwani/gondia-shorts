"use client";

// import { Button } from "@/components/ui/button";
// import { useModal } from "@/store/modal";

// export default function Test() {
//   const openModal = useModal((state) => state.setIsOpen);
//   return (
//     <div className="mt-48">
//       <Button
//         onClick={() => {
//           openModal(true);
//         }}
//       >
//         Sign In
//       </Button>
//       {/* <SignIn /> */}
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
// import { useQuery } from '@tanstack/react-query';
// import { Article } from '@shared/schema';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import NewsCard from "@/components/news-card/NewsCard";
import { v4 as uuid } from "uuid";

// Import required modules from swiper
import { Virtual, Mousewheel, Keyboard, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
// import { translateToHindi } from "@/lib/translateService";
import { Article } from "@/db/schema/article";
import { NewsCardSkeleton } from "@/components/Skeletons";
import { useArticles } from "@/store/articles";
import { sleep } from "@/hooks/hook-actions";
import { useInteractions } from "@/store/interaction";

const articles: Article[] = [
  {
    id: 101,
    title: "New Study Reveals Promising Treatment for Alzheimer's Disease",
    slug: "new-study-reveals-promising-treatment-for-alzheimers-disease",
    content:
      "Researchers at Johns Hopkins University have discovered a new treatment approach that significantly slows Alzheimer's progression in clinical trials. The treatment targets specific protein formations in the brain responsible for neural degeneration. In the 18-month study involving 412 patients, those receiving the treatment showed 47% less cognitive decline compared to the control group.",
    imageUrls: [
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    videoUrl: "https://youtube.com/shorts/G4-ds5UNZck?si=zqmOTEB9cCOTNZX0",
    type: "YOUTUBE_SHORTS",
    source: "National Health Journal",
    sourceLogoUrl: null,

    categoryId: 1,
    submittedById: 1,
    likeCount: 0,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 36,
    title: "Maharashtra T20 Cricket League to Feature Gondia Team",
    content:
      "The newly announced Maharashtra Premier League will include a Gondia Tigers franchise among its eight teams. Local cricketers will get opportunities alongside established players in the tournament starting next season. The Vidarbha Cricket Association is developing international-standard facilities in Gondia for training and matches.",
    imageUrls: [
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+1.png",
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+2.png",
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+3.png",
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+4.png",
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+5.png",
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+6.png",
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+7.png",
      "https://d7z3col9dhc88.cloudfront.net/verticle_image+8.png",
    ],
    videoUrl: null,
    type: "FULL_IMAGE",
    sourceLogoUrl: null,
    categoryId: 1,
    submittedById: 1,
    likeCount: 0,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 136,
    title: "Single  Verticle",
    content:
      "The newly announced Maharashtra Premier League will include a Gondia Tigers franchise among its eight teams. Local cricketers will get opportunities alongside established players in the tournament starting next season. The Vidarbha Cricket Association is developing international-standard facilities in Gondia for training and matches.",
    imageUrls: ["https://d7z3col9dhc88.cloudfront.net/verticle_image+8.png"],
    videoUrl: null,
    type: "FULL_IMAGE",
    sourceLogoUrl: null,
    categoryId: 1,
    submittedById: 1,
    likeCount: 0,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 36,
    title: "Maharashtra T20 Cricket League to Feature Gondia Team",
    content:
      "The newly announced Maharashtra Premier League will include a Gondia Tigers franchise among its eight teams. Local cricketers will get opportunities alongside established players in the tournament starting next season. The Vidarbha Cricket Association is developing international-standard facilities in Gondia for training and matches.",
    imageUrls: [],
    videoUrl: "https://d7z3col9dhc88.cloudfront.net/verticle_video.mp4",
    type: "FULL_VIDEO",
    sourceLogoUrl: null,
    categoryId: 1,
    submittedById: 1,
    likeCount: 0,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 5,
    title: "Bus Accident in Gondia Results in Multiple Fatalities",
    slug: "bus-accident-in-gondia-results-in-multiple-fatalities",
    content:
      "A tragic bus accident occurred in Gondia, resulting in the loss of several lives. Authorities are investigating the cause of the accident, and safety measures are being reviewed to prevent future incidents.",
    type: "YOUTUBE",
    source: "ChatGPT",
    videoUrl: "https://www.youtube.com/watch?v=OCmQBqNMvCQ",
    categoryId: 1,
    sourceLogoUrl: null,

    submittedById: 1,
    likeCount: 0,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 7,
    title:
      "Tech Giants Agree to New AI Safety Measures Following White House Summit",
    slug: "tech-giants-agree-to-new-ai-safety-measures-following-white-house-summit",
    content:
      "Seven leading technology companies have committed to new AI safety measures during a meeting at the White House. The voluntary commitments include testing AI systems for security risks before release, sharing information about AI safety, and investing in cybersecurity. The Biden administration pushed for the measures amid growing concerns about AI's potential risks.",
    imageUrls: [
      "https://images.unsplash.com/photo-1496979551903-46e46589a88b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "VIDEO_N_TEXT",
    source: "The Washington Post",
    sourceLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg/512px-The_Logo_of_The_Washington_Post_Newspaper.svg.png",
    categoryId: 3, // Technology

    submittedById: 1,
    likeCount: 0,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 8,
    title: "New Study Reveals Promising Treatment for Alzheimer's Disease",
    slug: "new-study-reveals-promising-treatment-for-alzheimers-disease",
    content:
      "Researchers at Johns Hopkins University have discovered a new treatment approach that significantly slows Alzheimer's progression in clinical trials. The treatment targets specific protein formations in the brain responsible for neural degeneration. In the 18-month study involving 412 patients, those receiving the treatment showed 47% less cognitive decline compared to the control group.",
    imageUrls: [
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    type: "IMAGE_N_TEXT",
    source: "National Health Journal",
    sourceLogoUrl: null,

    categoryId: 1,
    submittedById: 1,
    likeCount: 0,
    isLiked: false,
    isSaved: false,
  },
];

const TestPage = ({}) => {
  const setArticles = useArticles((state) => state.setArticles);
  const setInteractions = useInteractions((state) => state.setInteractions);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const swiperRef = useRef<SwiperType | null>(null);

  const handleSwipe = async (swiper: SwiperType) => {
    setPage(() => swiper.realIndex);
    // console.log("swiper real index => ", swiper.realIndex);
    // if (
    //   swiper.realIndex ===
    //   articles.length - (Number(process.env.NEXT_PUBLIC_FETCH_BEFORE) || 4)
    // ) {
    //   console.log("Fetching more articles...");
    // }
  };

  useEffect(() => {
    setIsLoading(true);
    sleep(3000).then(() => {
      setArticles(articles);
      const interactions = articles.map((art) => ({
        articleId: art.id,
        isLiked: true,
        isSaved: true,
        likeCount: 4,
      }));
      setInteractions(interactions);
      setIsLoading(false);
    });
  }, []);

  // Initial loading state
  if (page === 0 && isLoading) {
    return (
      // <div className="h-screen w-full pt-14 flex items-center justify-center">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      // </div>
      <NewsCardSkeleton />
    );
  }

  return (
    <div className="h-screen w-full relative">
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
        {isLoading && (
          <SwiperSlide className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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

export default TestPage;
