"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Article } from "@/db/schema/article";
import CommentModal from "@/components/comments/CommentModal";
// import { useTranslate } from "@/hooks/use-translate";
// import { translateToHindi } from "@/lib/translateService";
// import { likeArticle } from "@/actions/interaction";
import { SocialActions } from "./SocialActions";
import { NewsMedia } from "./NewsMedia";

interface NewsCardProps {
  isCurrentActive: boolean;
  isPreview?: boolean;
  isPreviewActive?: boolean;
  article: Article;
}

function NewsCard({
  isCurrentActive,
  isPreview = false,
  isPreviewActive = false,
  article,
}: NewsCardProps) {
  // const { isHindi } = useTranslate();
  // const [translatedHeadline, setTranslatedHeadline] = useState(article.title);
  // const [translatedSummary, setTranslatedSummary] = useState(article.content);

  useEffect(() => {
    console.log("NewsCard mounted with article:", article.id);
  }, []);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  if (isPreview && !isPreviewActive) return null; // don't render if not active
  const articleIdForPreview = uuid();
  // --- RENDERS ---
  return (
    <article
      key={isPreview ? articleIdForPreview : article.id}
      className="w-full h-full bg-white flex flex-col overflow-hidden"
    >
      {/* MEDIA */}
      <NewsMedia article={article} isCurrentActive={isCurrentActive} />

      {/* SOCIAL ACTIONS */}
      <SocialActions
        articleId={article.id}
        setIsCommentModalOpen={setIsCommentModalOpen}
        isPreview={isPreview}
      />

      {/* TEXT CONTENT */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="font-bold text-xl mb-2">{article.title}</h2>
        <p className="flex-1 text-gray-700">{article.content}</p>
      </div>

      {/* COMMENTS */}
      {isCommentModalOpen && (
        <CommentModal
          article={article}
          isOpen={true}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}
    </article>
  );
}

export default React.memo(
  NewsCard,
  function areEqual(
    prev: Readonly<NewsCardProps>,
    next: Readonly<NewsCardProps>
  ): boolean {
    return (
      prev.isCurrentActive === next.isCurrentActive &&
      prev.isPreview === next.isPreview &&
      prev.isPreviewActive === next.isPreviewActive &&
      prev.article.likeCount === next.article.likeCount &&
      prev.article.isSaved == next.article.isSaved &&
      prev.article.isLiked === next.article.isLiked
    );
  }
);
