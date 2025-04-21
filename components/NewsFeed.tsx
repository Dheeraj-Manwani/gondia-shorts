"use client";

import React, { useEffect, useRef, useState } from "react";
// import { useQuery } from '@tanstack/react-query';
// import { Article } from '@shared/schema';
import NewsCard from "./NewsCard";
import { useAction } from "@/hooks/use-action";
import { fetchArticles } from "@/actions/news";
import { Article } from "@/db/schema/news";

interface NewsFeedProps {
  categoryId: number;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ categoryId }) => {
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const loader = useRef<HTMLDivElement>(null);
  const limit = 4; // Number of articles to fetch per page

  const { data, error, isLoading } = useAction(fetchArticles);

  // const { data, isLoading, error } = useQuery<Article[]>({
  //   queryKey: ['/api/articles', { categoryId, limit, offset: page * limit }],
  //   enabled: true,
  // });

  // Update articles when data changes
  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     if (page === 0) {
  //       setArticles(data);
  //     } else {
  //       setArticles(prev => [...prev, ...data]);
  //     }
  //   }
  // }, [data, page]);

  // Reset articles and page when category changes
  useEffect(() => {
    setArticles([]);
    setPage(0);
  }, [categoryId]);

  // Infinite scroll setup
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && data && data.length >= limit) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [data, isLoading]);

  // Initial loading state
  if (page === 0 && isLoading) {
    return (
      <div className="py-4">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="max-w-[430px] rounded-[8px] bg-white shadow-md mx-auto mb-4 overflow-hidden"
            >
              <div className="aspect-[16/9] bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-[1px] bg-gray-200 my-3"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 max-w-md mx-auto text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Failed to load news articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-4 max-w-lg">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} isCurrentActive={false} />
      ))}

      {/* Loading indicator at the bottom */}
      <div ref={loader} className="flex justify-center py-8">
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        )}
      </div>

      {/* No more articles message */}
      {!isLoading && data && data.length === 0 && page > 0 && (
        <div className="text-center text-gray-500 py-4">
          No more articles to load
        </div>
      )}
    </main>
  );
};

export default NewsFeed;
