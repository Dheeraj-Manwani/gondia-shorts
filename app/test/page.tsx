"use client";

export default function Test() {
  return <div>Test</div>;
}

// import React, { useEffect, useState, useRef } from "react";
// // import { useQuery } from '@tanstack/react-query';
// // import { Article } from '@shared/schema';
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import NewsCard from "@/components/news-card/NewsCard";
// import { v4 as uuid } from "uuid";

// // Import required modules from swiper
// import { Virtual, Mousewheel, Keyboard, Navigation } from "swiper/modules";
// import type { Swiper as SwiperType } from "swiper";
// // import { translateToHindi } from "@/lib/translateService";
// import { Article } from "@/db/schema/article";
// import { NewsCardSkeleton } from "@/components/Skeletons";
// import { appSession } from "@/lib/auth";
// import { useArticles } from "@/store/articles";
// import { sleep } from "@/hooks/hook-actions";

// const articles: Article[] = [
//   {
//     id: 36,
//     title: "Maharashtra T20 Cricket League to Feature Gondia Team",
//     content:
//       "The newly announced Maharashtra Premier League will include a Gondia Tigers franchise among its eight teams. Local cricketers will get opportunities alongside established players in the tournament starting next season. The Vidarbha Cricket Association is developing international-standard facilities in Gondia for training and matches.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 35,
//     title: "Gondia to Get New Industrial Park Focusing on Agro-Processing",
//     content:
//       "The Maharashtra Industrial Development Corporation will establish a 200-acre agro-processing park near Gondia to add value to local farm produce. The ₹500 crore project will include food processing units, cold storage, and packaging facilities. At least 5,000 direct jobs are expected, with construction beginning next year.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1453745558060-956d4c4deff8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 34,
//     title: "Maharashtra Police Introduce AI-Based Crime Prediction",
//     content:
//       "Maharashtra Police have implemented an AI system that analyzes crime patterns to predict potential hotspots. The pilot in Nagpur division (including Gondia) reduced street crimes by 18% in three months. The system helps optimize patrol routes while addressing privacy concerns through strict data governance protocols.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 33,
//     title: "Gondia's Women SHGs Export Organic Products to Europe",
//     content:
//       "Self-help groups in Gondia have secured their first international order - €200,000 worth of organic turmeric and forest honey to Germany. The women-led collectives underwent extensive training in quality standards and export procedures. This breakthrough opens new income opportunities for rural women in the region.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 32,
//     title: "Maharashtra Tops in Renewable Energy Capacity Addition",
//     content:
//       "Maharashtra added 2,500 MW of renewable energy capacity last year, leading all Indian states. Solar parks in Vidarbha and wind farms in Western Maharashtra contributed most to this growth. The state aims for 50% renewable power by 2030, with new projects planned near Gondia leveraging the region's high solar irradiance.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 31,
//     title: "Gondia District Library Digitizes Rare Manuscript Collection",
//     content:
//       "Gondia's century-old district library has completed digitizing its collection of 5,000 rare manuscripts dating back to the 15th century. The project preserves historical texts on philosophy, medicine, and local Gond culture. Digital access will be available to researchers worldwide through the National Digital Library of India portal.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 30,
//     title: "Maharashtra Farmers Switch to Climate-Resilient Crops",
//     content:
//       "Over 50,000 farmers across Maharashtra, including in Gondia district, have transitioned to millets and drought-resistant crop varieties. State agriculture departments provide training and market linkages, helping farmers adapt to changing rainfall patterns. Early adopters report 20-30% higher incomes despite lower water usage.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 29,
//     title: "Gondia's Ancient Temples to Undergo Restoration",
//     content:
//       "The Archaeological Survey of India has allocated ₹8 crore for restoring Gondia's 12th-century Shiva temples. The project will preserve intricate carvings and structural integrity while improving visitor facilities. These temples represent an important example of medieval Gondwana architecture and attract history enthusiasts nationwide.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 28,
//     title: "Maharashtra Launches Free Healthcare Scheme for Senior Citizens",
//     content:
//       "The 'Maharashtra Arogya Vardhini' program will provide free medical care to all residents above 60 years, covering diagnostics, medicines, and hospitalization. Over 1.5 crore senior citizens will benefit, with special mobile units serving rural areas like Gondia. The ₹2,000 crore initiative is India's most comprehensive state healthcare scheme for elders.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
//   {
//     id: 27,
//     title: "Gondia Hosts First International Yoga Festival",
//     content:
//       "Gondia welcomed over 5,000 participants to its inaugural International Yoga Festival, featuring masters from 15 countries. The week-long event included workshops, meditation sessions, and research presentations on yoga's health benefits. The district administration plans to make this an annual event to promote wellness tourism.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
//     ],
//     videoUrl: null,
//     type: "IMAGE_N_TEXT",
//     sourceLogoUrl: null,
//     categoryId: 1,
//     submittedById: 1,
//     likeCount: 0,
//     isLiked: false,
//     isSaved: false,
//   },
// ];

// interface SwipeableNewsFeedProps {
//   session: appSession;
//   categoryId: number;
//   articleSlug?: string | null;
// }

// const SwipeableNewsFeed: React.FC<SwipeableNewsFeedProps> = ({}) => {
//   const setArticles = useArticles((state) => state.setArticles);
//   const [page, setPage] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const swiperRef = useRef<SwiperType | null>(null);

//   const handleSwipe = async (swiper: SwiperType) => {
//     setPage(() => swiper.realIndex);
//     // console.log("swiper real index => ", swiper.realIndex);
//     // if (
//     //   swiper.realIndex ===
//     //   articles.length - (Number(process.env.NEXT_PUBLIC_FETCH_BEFORE) || 4)
//     // ) {
//     //   console.log("Fetching more articles...");
//     // }
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     sleep(3000).then(() => {
//       setArticles(articles);
//       setIsLoading(false);
//     });
//   }, []);

//   // Initial loading state
//   if (page === 0 && isLoading) {
//     return (
//       // <div className="h-screen w-full pt-14 flex items-center justify-center">
//       //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       // </div>
//       <NewsCardSkeleton />
//     );
//   }

//   return (
//     <div className="h-screen w-full pt-14 relative">
//       {/* Add padding top for header */}
//       <Swiper
//         modules={[Virtual, Mousewheel, Keyboard, Navigation]}
//         direction="vertical"
//         spaceBetween={0}
//         slidesPerView={1}
//         virtual
//         mousewheel
//         keyboard
//         // onReachEnd={handleReachEnd}
//         className="h-full"
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         onSlideChange={(swiper) => {
//           handleSwipe(swiper);
//         }}
//       >
//         {articles.map((article, index) => (
//           <SwiperSlide
//             virtualIndex={index}
//             className="h-full w-full"
//             key={uuid()}
//           >
//             <NewsCard
//               article={article}
//               isCurrentActive={page === index}
//               key={uuid()}
//             />
//           </SwiperSlide>
//         ))}

//         {/* Loading indicator at the bottom */}
//         {isLoading && (
//           <SwiperSlide className="h-full flex items-center justify-center">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//           </SwiperSlide>
//         )}
//       </Swiper>
//       {/* Swipe indicator */}
//       <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-20">
//         <div className="flex flex-col items-center animate-bounce">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-gray-300 drop-shadow-md"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <p className="text-xs text-zinc-400 font-medium drop-shadow-md">
//             Swipe up for next
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SwipeableNewsFeed;
