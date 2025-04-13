import React, { useState, useRef, useEffect } from "react";
// import { useLocation } from 'wouter';
// import { Article } from '@shared/schema';
import { formatDate } from "@/lib/helpers";
import CommentModal from "./CommentModal";
import { useTranslate } from "@/hooks/use-translate";
import { translateToHindi } from "@/lib/translateService";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Article } from "@/db/schema/news";
import { Share2 } from "lucide-react";

interface NewsCardProps {
  article: Article;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
}: {
  article: Article;
}) => {
  // const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { isHindi } = useTranslate();

  const [translatedHeadline, setTranslatedHeadline] = useState(article.title);
  const [translatedSummary, setTranslatedSummary] = useState(article.content);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  // Effect for translation when language changes
  useEffect(() => {
    const translateContent = async () => {
      if (isHindi) {
        try {
          const hindiHeadline = await translateToHindi(article.title);
          const hindiSummary = await translateToHindi(article.content);
          setTranslatedHeadline(hindiHeadline);
          setTranslatedSummary(hindiSummary);
        } catch (error) {
          console.error("Error translating content:", error);
        }
      } else {
        setTranslatedHeadline(article.title);
        setTranslatedSummary(article.content);
      }
    };

    translateContent();
  }, [isHindi, article.title, article.content]);

  // Effect for autoplay when the video comes into view
  useEffect(() => {
    if (article.isVideo && videoRef.current) {
      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.5,
      });

      observer.observe(videoRef.current);

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }
  }, [article.isVideo]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoMuted(!videoMuted);
    }
  };

  const handleCardClick = () => {
    // setLocation(`/article/${article.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open WhatsApp directly instead of showing the share modal
    const shareUrl = `${window.location.origin}/article/${article.id}`;
    const text = `Check out this article: ${article.title}`;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text + " " + shareUrl
    )}`;
    window.open(whatsappLink, "_blank");
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentModalOpen(true);
  };

  return (
    <article
      className="news-card w-full h-full bg-white overflow-hidden relative flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Card Media - Image, Multiple Images, or Video */}
      <div className="h-[40vh] relative bg-gray-200">
        {article.isVideo && article.videoUrl ? (
          <div className="h-full w-full relative">
            <video
              ref={videoRef}
              src={article.videoUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              loop
              onClick={handleVideoClick}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>

            {/* Video controls */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              <button
                onClick={toggleMute}
                className="p-2 bg-black/40 backdrop-blur-sm rounded-full"
                aria-label={videoMuted ? "Unmute" : "Mute"}
              >
                {videoMuted ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      clipRule="evenodd"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={handleVideoClick}
                className="p-2 bg-black/40 backdrop-blur-sm rounded-full"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : article.imageUrls && article.imageUrls.length > 1 ? (
          // Image carousel for multiple images
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            className="h-full w-full"
            onClick={(swiper, e: TouchEvent | MouseEvent | PointerEvent) =>
              e.stopPropagation()
            }
          >
            <SwiperSlide>
              <img
                src={article.imageUrls[0]}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </SwiperSlide>
            {article.imageUrls.map((imgUrl: string, index: number) => (
              <SwiperSlide key={index}>
                <img
                  src={imgUrl}
                  alt={`${article.title} - image ${index + 2}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>
          </Swiper>
        ) : (
          // Single image display
          <img
            src={article.imageUrls[0]}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Image gradient overlay - only for single image */}
        {!article.isVideo &&
          (!article.imageUrls || article.imageUrls.length === 1) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          )}

        {/* Category tag removed as requested */}

        {/* Source info overlay at the bottom of the image */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-white drop-shadow-md">
              {article.sourceText}
            </span>
            {article.sourceLogoUrl && (
              <img
                src={article.sourceLogoUrl}
                alt="Source logo"
                className="h-4 ml-2 bg-white rounded-full p-0.5"
              />
            )}
          </div>
          <span className="text-xs text-white/90 drop-shadow-md">
            {formatDate(article.publishedAt || new Date())}
          </span>
        </div>
      </div>

      {/* Social Interaction Buttons - Instagram style */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Like button */}
            <button
              onClick={handleLike}
              className="text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Like"
            >
              {isLiked ? (
                <svg
                  className="w-7 h-7 text-red-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>

            {/* Comment button */}
            <button
              onClick={handleComment}
              className="text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Comment"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share"
            >
              <Share2 />
              {/* <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg> */}
            </button>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className=" text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Save"
          >
            {isSaved ? (
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 px-4 pt-3 pb-6 flex flex-col">
        {/* Headline */}
        <h2 className="text-gray-600 font-bold text-xl sm:text-2xl leading-tight mb-4">
          {isHindi ? translatedHeadline : article.title}
        </h2>

        {/* Summary */}
        <div className="flex-1">
          <p className="text-base leading-relaxed text-gray-700">
            {isHindi ? translatedSummary : article.content}
          </p>
        </div>
      </div>

      {/* Removed swipe indicator arrows as requested */}

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <CommentModal
          article={article}
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}
    </article>
  );
};

export default NewsCard;
