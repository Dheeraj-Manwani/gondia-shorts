"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { fetchArticles } from "@/actions/articles/articles";
import { Article } from "@/db/schema/news";
import { useRouter } from "next/navigation";
// import { newsItems } from "@/data/sample-news";
// import { useLocation } from "wouter";

export default function NewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  //   const [, setLocation] = useLocation();

  const {
    execute,
    data: newsItems,
    isLoading,
    error,
  } = useAction<{ limit: number; offset: number }, Article>(fetchArticles);
  useEffect(() => {
    if (!newsItems && !isLoading) execute({ limit: 5, offset: 10 });
  }, []);

  if (isLoading || !newsItems)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading news</p>
      </div>
    );

  const scrollToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
      setActiveIndex((prev) => Math.min(prev + 1, newsItems.length - 1));
    }
  };

  const scrollToPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-montserrat text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Experience News Like Never Before
        </motion.h2>

        <div className="relative overflow-hidden">
          <div
            className="flex space-x-6 py-8 overflow-x-auto hide-scrollbar"
            ref={carouselRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {newsItems.map((news, index) => (
              <motion.div
                key={index}
                className="news-card flex-shrink-0 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="w-full h-44 bg-gray-200 relative">
                  {news.imageUrls && (
                    <div
                      className="w-full h-full object-cover"
                      style={{
                        backgroundImage: `url(${news.imageUrls[0]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">
                    {news.categoryId} • {"(news.publishedAt)"}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{news.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{news.content}</p>
                  <div className="flex justify-between items-center">
                    <button className="text-secondary font-medium text-sm">
                      Read More
                    </button>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-400 hover:text-primary"
                        aria-label="Share"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-primary"
                        aria-label="Bookmark"
                      >
                        <Bookmark size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            className="absolute top-1/2 -left-2 transform -translate-y-1/2 z-10 lg:block hidden bg-white p-3 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            onClick={scrollToPrev}
            aria-label="Previous news"
          >
            <ChevronLeft className="text-gray-600" size={20} />
          </button>

          <button
            className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 lg:block hidden bg-white p-3 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            onClick={scrollToNext}
            aria-label="Next news"
          >
            <ChevronRight className="text-gray-600" size={20} />
          </button>
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex space-x-2">
            {newsItems.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full",
                  index === activeIndex ? "bg-primary" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => router.push("/feed")}
            className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-6 rounded-full shadow transition-all duration-300 flex items-center mx-auto"
          >
            Swipe for more news
            <ChevronRight className="ml-2" size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
